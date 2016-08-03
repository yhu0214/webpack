/* eslint no-console: 0 */
/*
This service expects that string messages come in JSON format with the following params:
@param type {String} - Type of message (pass "*" to receive all types)
@param data {Number | String | Object | Array} (Optional) - Data that goes along with the message
*/

import Vue from 'vue';
import Socket from './Socket';
import Keyboard from './Keyboard';

export default new Vue({
  created() {
    // setup the wildcard listeners
    this.wildcardListeners = [];

    // hijack the listener
    const oldOn = this.$on;
    this.$on = (...args) => {
      // if the first argument is *, then we emit all events to this callback
      if (args[0] === '*') {
        const index = this.wildcardListeners.indexOf(args[1]);
        if (index === -1) {
          this.wildcardListeners.push(args[1]);
        }
      }

      oldOn.apply(this, args);
    };

    const oldOff = this.$off;
    this.$off = (...args) => {
      // if the first argument is *, then we kill the callback
      if (args[0] === '*') {
        const index = this.wildcardListeners.indexOf(args[1]);
        if (index !== -1) {
          this.wildcardListeners.splice(index, 1);
        }
      }

      oldOff.apply(this, args);
    };

    // listen to socket messages
    Socket.$on('*', (data) => {
      this.parseMessage(data, 'Socket');
    });

    // listen to keyboard presses
    Keyboard.$on('*', (data) => {
      this.parseMessage(data, 'Keyboard');
    });
  },
  methods: {
    parseMessage(jsonStr, src) {
      try {
        const msg = JSON.parse(jsonStr);
        if (msg.type === undefined) {
          // well that ain't good
          console.error('parseMessage missing "type" param in raw message:', jsonStr);
          return;
        }

        // go ahead and emit the event now
        this.$emit(msg.type, msg.data);

        // also emit it to the listeners that wanted to know about it
        this.wildcardListeners.forEach((callback) => {
          callback(msg.type, msg.data);
        });
      } catch (error) {
        console.error('JSON parsing error on:', src, 'Error:', error, 'Raw:', jsonStr);
        this.$emit('error', `JSON parsing error on "${src}": ${error} -- Raw: ${jsonStr}`);
      }
    },
    send(type, data) {
      Socket.send(type, data);
    },
  },
});

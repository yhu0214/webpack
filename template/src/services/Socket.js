/*
This should only be imported by the "Messages" service
*/
import Vue from 'vue';
import io from 'socket.io-client';
import wildcard from 'socketio-wildcard';
import store from '../vuex/store';
import {
  socketConnected,
  socketDisconnected,
} from '../vuex/actions';

export default new Vue({
  created() {
    const socket = io();

    socket.on('connect', this.socketConnected);
    socket.on('disconnect', this.socketDisconnected);

    // patch our socket so that we can use wildcards
    const patch = wildcard(io.Manager);
    patch(socket);

    socket.on('*', message => {
      let type = message.data[0];
      let data = message.data[1];

      if (type === 'message') {
        if (typeof data === 'string') {
          // this is a raw message sent to the socket
          const parsedMessage = JSON.parse(data);
          type = parsedMessage.type;
          data = parsedMessage.data;
        } else {
          // this is an object
          type = data.type;
          data = data.data;
        }
      }

      this.$emit('*', JSON.stringify({
        type,
        data,
      }));
    });

    this.send = (type, data) => {
      try {
        socket.send({ type, data });
      } catch (error) {
        /* eslint no-console: 0 */
        console.error('Error sending message to socket. type:', type, 'data:', data);
      }
    };
  },
  vuex: {
    actions: {
      socketConnected,
      socketDisconnected,
    },
  },
  store,
});

import Vue from 'vue';

export const KEY_CODES = {
  // dpad
  SELECT: 13,
  UP: 38,
  LEFT: 37,
  RIGHT: 39,
  DOWN: 40,

  VOLUME_UP: 65, // A
  VOLUME_DOWN: 90, // Z
  HOME: 72, // H
  MENU: 77, // M
  NOTIFICATIONS: 78, // N
  POWER: 80, // P
  BACK: 82, // R
  VOICE: 86, // V

  // global functions
  SOURCE: 81, // Q
  PLUGIN: 85, // new source/device pluged-in (historically USB)

  // numbers
  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
};

const NO_REPEAT_KEYS = {
  POWER: false, // when set to true it's pressed and won't be dispatched again
};

export default new Vue({
  created() {
    window.addEventListener('keydown', this.handleKeys, false);
    window.addEventListener('keyup', this.handleKeys, false);
  },
  destroyed() {
    window.removeEventListener('keydown', this.handleKeys, false);
    window.removeEventListener('keyup', this.handleKeys, false);
  },
  methods: {
    handleKeys(event) {
      Object.keys(KEY_CODES).forEach(name => {
        if (event.keyCode === KEY_CODES[name]) {
          // check to see if this key is not allowed to repeat
          if (NO_REPEAT_KEYS[name] !== undefined) {
            if (NO_REPEAT_KEYS[name] && event.type === 'keydown') return;
            NO_REPEAT_KEYS[name] = event.type === 'keydown';
          }

          if (event.type === 'keydown') {
            this.$emit(name);
            this.$emit('*', JSON.stringify({ type: 'button', data: name }));
          }
        }
      });
    },
  },
});

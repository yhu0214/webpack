export default {
  data() {
    return {
      swipe: { offsetX: 0, override: false },
      SWIPE_MOVE_DISTANCE: 20, // how many px before we count this as a move
      SWIPE_DISTANCE: 200, // how many px before this is a swipe
      SWIPE_TAP_TIME: 160, // how fast a tap must be in ms
      SWIPE_HOLD_TIME: 500, // how long to hold without moving to trigger
      multiTouch: false,
    };
  },
  methods: {
    swipeStart(event) {
      this.multiTouch = event.touches.length > 1;
      if (this.multiTouch) return;

      this.swipe.startX = event.touches[0].clientX;
      this.swipe.startY = event.touches[0].clientY;
      this.swipe.time = new Date().getTime();

      this.swipe.holdTimer = setTimeout(() => {
        if (!this.swipe.hasMoved) {
          this.swipeHold(event);
        }
      }, this.SWIPE_HOLD_TIME);

      this.swipeMove(event);
    },
    swipeMove(event) {
      // we might need to force the swipe to not listen to movements
      if (this.swipe.override) {
        clearTimeout(this.swipe.holdTimer);
        return;
      }

      this.swipe.offsetX = this.swipe.startX - event.touches[0].clientX;
      this.swipe.offsetY = this.swipe.startY - event.touches[0].clientY;

      const distance = Math.abs(this.swipe.offsetX);
      if (distance >= this.SWIPE_MOVE_DISTANCE) {
        this.swipe.hasMoved = true;
      }
    },
    swipeEnd(event) {
      if (this.swipe.override) {
        this.swipe.override = false;
        return;
      }

      if (this.multiTouch) {
        this.multiTouch = false;
        return;
      }

      const timeDiff = new Date().getTime() - this.swipe.time;

      // check if this was a tap
      if (timeDiff <= this.SWIPE_TAP_TIME && !this.swipe.hasMoved) {
        this.swipeTap(event);
      }

      if (this.swipe.offsetX > this.SWIPE_DISTANCE) {
        this.swipeNext();
      } else if (this.swipe.offsetX < -this.SWIPE_DISTANCE) {
        this.swipePrev();
      }
      this.swipe.offsetX = 0;
      this.swipe.hasMoved = false;
      clearTimeout(this.swipe.holdTimer);
    },
    swipePrev() {
      // console.warn('swipePrev method is not defined in your component');
    },
    swipeNext() {
      // console.warn('swipeNext method is not defined in your component');
    },
    swipeTap(event) {
      // tapping isn't required, so no need to spit out the warning
      this.$emit('swipe-tap', event);
    },
    swipeHold(event) {
      // holding isn't required, so no need to spit out the warning
      this.$emit('swipe-hold', event);
    },
  },
};

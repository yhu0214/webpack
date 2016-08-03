<template>
  <div 
    class="swipe-area"
    @touchStart.prevent="swipeStart" 
    @touchMove.prevent="swipeMove"
    @touchEnd="swipeEnd">
    <div 
      class="widget-holder"
      :class="{ moving: swipe.offsetX !== 0 }"
      :style="{ transform: `translateX(${containerOffset})` }"
      v-el:widget-holder>
      <div class="widget" v-for="num in pages.total">Widget {{ (num + 1) }}</div>
    </div>
  </div>
  <dot-nav :current="pages.current" :total="pages.total"></dot-nav>
</template>

<script>
import DotNav from './_common/DotNav';
import Messages from '../services/Messages';

import swipeMixin from '../mixins/js/swipeMixin';
import styleMixin from '../mixins/js/styleMixin';

import {
  language,
} from '../vuex/getters';

import {
  pages,
} from '../vuex/modules/Home/getters';

import {
  prevPage,
  nextPage,
} from '../vuex/modules/Home/actions';

export default {
  mixins: [swipeMixin, styleMixin],
  created() {
    Messages.$on('button', this.handleButton);
  },
  beforeDestroy() {
    // make sure we are done with touch events
    this.swipeEnd();
    Messages.$off('button', this.handleButton);
  },
  computed: {
    containerOffset() {
      const offset = this.swipe.offsetX;
      const position = -(this.pages.current - 1) * this.$els.widgetHolder.clientWidth - offset;

      return this.getStyleValue(position);
    },
  },
  methods: {
    swipeNext() {
      this.nextPage();
    },
    swipePrev() {
      this.prevPage();
    },
    handleButton(type) {
      switch (type) {
        case 'LEFT':
          this.prevPage();
          break;
        case 'RIGHT':
          this.nextPage();
          break;
        default:
          break;
      }
    },
  },
  components: {
    DotNav,
  },
  vuex: {
    getters: {
      language,
      pages,
    },
    actions: {
      prevPage,
      nextPage,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../mixins/scss/main';

$widet-size: $s * 500;

.swipe-area {
  overflow: hidden;
  position: relative;
  width: $widet-size;
  height: $widet-size;

  .widget-holder {
    display: flex;
    transition: $defaultTransition;
    position: absolute;
    width: 100%;
    height: 100%;

    &.moving {
      transition: none;
    }

    .widget {
      display: flex;
      flex: 0 0 100%;
      width: 100%;
      height: 100%;
      background: rgba(#000, 0.5);
      align-items: center;
      justify-content: center;
      font-size: $s * 60;
    }
  }
}

// style the dot nav
.dot-nav {
  width: $widet-size;
  margin-top: $s * 10;

  .dot {
    background-color: rgba(#000, 0.5);

    &.active {
      background-color: #000;
    }
  }
}
</style>

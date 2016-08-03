<template>
  <div 
    class="swipe-area"
    @touchStart.prevent="swipeStart" 
    @touchMove.prevent="swipeMove"
    @touchEnd="swipeEnd">
    <div 
      class="widget-holder"
      :class="{ moving: swipe.offsetX !== 0 }" 
      :style="{ transform: `translateX(${containerOffset})` }">
      <div class="widget" v-for="num in pages.total">Widget {{ num }}</div>
    </div>
  </div>
  <dot-nav :current="pages.current" :total="pages.total"></dot-nav>
</template>

<script>
import DotNav from '../_common/DotNav';

import swipeMixin from '../../mixins/js/swipeMixin';

import {
  fullscreenView,
  language,
} from '../../vuex/getters';

import {
  prevPage,
  nextPage,
} from '../../vuex/actions';

export default {
  mixins: [swipeMixin],
  ready() {
    this.widgetHolder = this.$el.querySelector('.widget-holder');
  },
  beforeDestroy() {
    // make sure we are done with touch events
    this.swipeEnd();
  },
  data() {
    return {
      widgetHolder: undefined,
    };
  },
  computed: {
    containerOffset() {
      const position = (this.pages.current - 1) * widgetHolder.clientWidth - this.swipe.offsetX;

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
  },
  components: {
    DotNav,
  },
  vuex: {
    getters: {
      fullscreenView,
      language,
    },
    actions: {
      prevPage,
      nextPage,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '../../mixins/scss/main';

.swipe-area {
  overflow: hidden;
  position: relative;
  width: $s * 500;
  height: $s * 500;

  .widget-holder {
    display: flex;
    transition: $defaultTransition;
    position: absolute;

    &.moving {
      transition: none;
    }

    .widget {
      display: inline-table;
    }
  }
}
</style>

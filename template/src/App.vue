<template>
  <component 
    :is="fullscreenView" 
    :key="fullscreenView">
  </component>
</template>

<script>
import store from '../vuex/store';

import {
  fullscreenView,
} from '../vuex/getters';

import Home from './components/Home';

export default {
  vuex: {
    getters: {
      fullscreenView,
    },
  },
  components: {
    Home,
  },
  store,
};
</script>

<style lang="scss">
@import '../mixins/scss/main';
@import '../mixins/scss/fonts';

* {
  padding: 0;
  margin: 0;
  border: 0;
  box-sizing: border-box;
}

::-webkit-scrollbar {
  display: none;
}

html, body {
  height: $h;
  width: $w;
  overflow: hidden;
  font-family: 'SamsungOneUI300';
}
</style>

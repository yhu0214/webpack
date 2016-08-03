import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
} from './mutation-types';

import home from './modules/Home/store-module';

// get URL param to see what version of the test we need to show
function getQueryVar(name) {
  const query = window.location.search.substring(1);
  const vars = query.split('&');

  for (let i = 0; i < vars.length; i++) {
    const chunks = vars[i].split('=');
    if (chunks[0] === name) return chunks[1];
  }

  return null;
}

const state = {
  lang: 'en',
  fullscreenView: 'home',
  socketConnected: false,
  testVersion: getQueryVar('test'),
};

// creates a list of names of all store modules
const init = {
  onInit(st, store) {
    /* eslint-disable */
    const names = Object.getOwnPropertyNames(store._modules);
    store.dispatch('INIT', names);
  },
};

const mutations = {
  // sets up 'lang' prop in each store module
  ['INIT'](st, data) {
    data.forEach(name => {
      state[name].lang = state.lang;
    });
  },
  [SOCKET_CONNECTED]() {
    state.socketConnected = true;
  },
  [SOCKET_DISCONNECTED]() {
    state.socketConnected = false;
  },
};

export default new Vuex.Store({
  state,
  mutations,
  middlewares: [init],
  modules: {
    home,
  },
});

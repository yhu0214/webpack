import {
  NEXT_PAGE,
  PREV_PAGE,
  ADD_PAGE,
} from './mutation-types';

const state = {
  pages: {
    current: 1,
    total: 2,
    max: 20,
  },
};

const mutations = {
  [NEXT_PAGE]() {
    if (state.pages.current < state.pages.total) state.pages.current++;
  },
  [PREV_PAGE]() {
    if (state.pages.current > 1) state.pages.current--;
  },
  [ADD_PAGE]() {
    if (state.pages.total < state.pages.max) state.pages.total++;
  },
};

export default {
  state,
  mutations,
};

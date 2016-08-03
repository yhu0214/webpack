import {
  NEXT_PAGE,
  PREV_PAGE,
  ADD_PAGE,
} from './mutation-types';

export const prevPage = ({ dispatch }) => {
  dispatch(PREV_PAGE);
};

export const nextPage = ({ dispatch }) => {
  dispatch(NEXT_PAGE);
};

export function addPage({ dispatch }) {
  dispatch(ADD_PAGE);
}

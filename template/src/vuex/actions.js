import {
  SOCKET_CONNECTED,
  SOCKET_DISCONNECTED,
} from './mutation-types';

export function socketConnected({ dispatch }) {
  dispatch(SOCKET_CONNECTED);
}

export function socketDisconnected({ dispatch }) {
  dispatch(SOCKET_DISCONNECTED);
}

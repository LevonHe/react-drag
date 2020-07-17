let base = '';
let websocket = window.location.host;

if (process.env && process.env.NODE_ENV === 'development') {
  base = 'http://localhost:3000';
  websocket = 'localhost:3000';
}

if (window.location.protocol === 'https:') {
  websocket = 'wss://' + websocket;
} else {
  websocket = 'ws://' + websocket;
}

export const baseUrl = base;
export const websocketUrl = websocket;

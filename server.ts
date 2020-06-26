import 'zone.js/dist/zone-node';
import './server/main';
export * from './src/main.server';

// Polyfills required for Firebase
(global as any).WebSocket = require('ws');
(global as any).XMLHttpRequest = require('xhr2');
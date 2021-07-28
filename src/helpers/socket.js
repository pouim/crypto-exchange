import  io  from 'socket.io-client';
var socket_url = 'http://130.185.77.49:10000';
export const socket = io(socket_url);
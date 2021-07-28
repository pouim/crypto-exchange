// // api/stream.js
// import { parseFullSymbol } from './helpers.js';
// import historyProvider from './historyProvider.js';
// import pairs from './pairs';
// import Cookies from 'js-cookie';
// // we use Socket.io client to connect to cryptocompare's socket.io stream
// import { socket } from '../../helpers/socket';
// import { makeStore } from 'store/index';
// // keep track of subscriptions

// const channelToSubscription = new Map();


// const Store = makeStore();


// function getNextDailyBarTime(barTime) {
//     const date = new Date(barTime * 1000);
//     date.setDate(date.getDate() + 1);
//     return date.getTime() / 1000;
// }

// socket.on('get current price response', (data) => {
//     console.log('[socket] Message:', data);
//     const parsedData = JSON.parse(data.data);
//     const tradePrice = parseFloat(parsedData[1]);
//     const tradeTime = parseInt(parsedData[0]);
//     console.log('tradeTime', tradeTime);
//     const channelString = `0~Bitfinex~BTC~USD`; //TODO//
//     const subscriptionItem = channelToSubscription.get(channelString);
//     if (subscriptionItem === undefined) {
//         return;
//     }
//     const lastDailyBar = subscriptionItem.lastDailyBar
//         ? subscriptionItem.lastDailyBar
//         : JSON.parse(localStorage.getItem('lastBarOtc'));

//     const nextDailyBarTime = getNextDailyBarTime(JSON.parse(localStorage.getItem('lastBarOtc'))?.time);
//     console.log('nextDailyBarTime', nextDailyBarTime ,JSON.parse(localStorage.getItem('lastBarOtc'))?.time);
//     Cookies.set('sid', data.sid);

//     let bar;
//     if (tradeTime >= nextDailyBarTime) {
//         bar = {
//             time: nextDailyBarTime,
//             open: tradePrice,
//             high: tradePrice,
//             low: tradePrice,
//             close: tradePrice,
//         };
//         console.log('[socket] Generate new bar', bar);
//     } else {
//         bar = {
//             ...JSON.parse(localStorage.getItem('lastBarOtc')),
//             high: Math.max(JSON.parse(localStorage.getItem('lastBarOtc'))?.high, tradePrice),
//             low: Math.min(JSON.parse(localStorage.getItem('lastBarOtc'))?.low, tradePrice),
//             close: tradePrice,
//         };
//         console.log('[socket] Update the latest bar by price', tradePrice);
//     }
//     subscriptionItem.lastDailyBar = bar;

//     // send data to every subscriber of that symbol
//     subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
// });


// export function subscribeOnStream(
//     symbolInfo,
//     resolution,
//     onRealtimeCallback,
//     subscribeUID,
//     onResetCacheNeededCallback,
//     lastDailyBar,
// ) {
    
//     const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
//     Cookies.set('symbolInfo', symbolInfo);
//     const channelString = `0~${parsedSymbol.exchange}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;
//     const handler = {
//         id: subscribeUID,
//         callback: onRealtimeCallback,
//     };
//     let subscriptionItem = channelToSubscription.get(channelString);
//     if (subscriptionItem) {
//         // already subscribed to the channel, use the existing subscription
//         subscriptionItem.handlers.push(handler);
//         return;
//     }
//     subscriptionItem = {
//         subscribeUID,
//         resolution,
//         lastDailyBar,
//         handlers: [handler],
//     };
//     channelToSubscription.set(channelString, subscriptionItem);
//     console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString);
    
//     console.log('lastDailyBar', lastDailyBar);
//     const otcToken = Cookies.get('otcToken');
//     // const urlParameters = {
//     //     symbol: `${parsedSymbol.fromSymbol}${parsedSymbol.toSymbol}`,
//     //     rate: 1,
//     //     token: `${otcToken}`
//     // };
//     // socket.emit('get current price', urlParameters);
// }

// export function unsubscribeFromStream(subscriberUID) {
//     // find a subscription with id === subscriberUID
//     const symbolInfo = JSON.parse(Cookies.get('symbolInfo'));
//     const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    
//     const otcToken = Cookies.get('otcToken');
//     const sid = Cookies.get('sid');
//     for (const channelString of channelToSubscription.keys()) {
//         const subscriptionItem = channelToSubscription.get(channelString);
//         const handlerIndex = subscriptionItem.handlers.findIndex(
//             (handler) => handler.id === subscriberUID,
//         );

//         if (handlerIndex !== -1) {
//             // remove from handlers
//             subscriptionItem.handlers.splice(handlerIndex, 1);

//             if (subscriptionItem.handlers.length === 0) {
//                 // unsubscribe from the channel, if it was the last handler
//                 console.log(
//                     '[unsubscribeBars]: Unsubscribe from streaming. Channel:',
//                     channelString,
//                 );
                
//                 const stopData = {
//                     symbol: `${parsedSymbol.fromSymbol}${parsedSymbol.toSymbol}`,
//                     token: `${otcToken}`,
//                     rate: 1,
//                     sid: `${sid}`,
//                 };
//                 // socket.emit('stop receive', stopData);
//                 console.log('socket Stoped on Stream!')
//                 channelToSubscription.delete(channelString);
//                 break;
//             }
//         }
//     }
// }



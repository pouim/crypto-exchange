// api/stream.js
import Cookies from 'js-cookie';
const accessToken = Cookies.get('token');

var send;
var client;

import { parseFullSymbol } from './helpers.js';
import historyProvider from './historyProvider.js';
import pairs from './pairs';


const channelToSubscription = new Map();


function getNextDailyBarTime(barTime) {
    const date = new Date(barTime * 1000);
    date.setDate(date.getDate() + 1);
    return date.getTime() / 1000;
}


export function subscribeOnStream(
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback,
    lastDailyBar,
) {
    const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
    const channelString = `0~${parsedSymbol.exchange}~${parsedSymbol.fromSymbol}~${parsedSymbol.toSymbol}`;
    const handler = {
        id: subscribeUID,
        callback: onRealtimeCallback,
    };
    let subscriptionItem = channelToSubscription.get(channelString);
    if (subscriptionItem) {
        // already subscribed to the channel, use the existing subscription
        subscriptionItem.handlers.push(handler);
        return;
    }
    subscriptionItem = {
        subscribeUID,
        resolution,
        lastDailyBar,
        handlers: [handler],
    };
    channelToSubscription.set(channelString, subscriptionItem);
    console.log('[subscribeBars]: Subscribe to streaming. Channel:', channelString);
    console.log('lastDailyBar', lastDailyBar);
    // socket.emit('SubAdd', { subs: [channelString] });

    function connect() {
        client = new WebSocket(`${process.env.WS_BASE_URL}/?token=${accessToken}`);
        send = (symbol) => {
            const data = { 'action': 'subscribe', 'data': `chart-${symbol}` };
            if (client.readyState == 1) {
                client.send(JSON.stringify(data));
            }
        };
        client.onopen = function () {
            console.log('Wssssssssssssssss Connected');
            send(`${parsedSymbol.fromSymbol}-${parsedSymbol.toSymbol}`);

            // subscribe to some channels
        };

        client.onmessage = function (message) {
            const msg = JSON.parse(message.data);

            if (msg.model == 'chart') {
                const exchange = 'Bitfinex';
                const eventTypeStr = 0;
                const fromSymbol = msg.data.base_coin;
                const toSymbol = msg.data.quote_coin;
                const tradePriceStr = msg.data.price;
                const tradeTimeStr = 1614507649;

                if (parseInt(eventTypeStr) !== 0) {
                    // skip all non-TRADE events
                    return;
                }
                const tradePrice = parseFloat(tradePriceStr);
                const tradeTime = parseInt(tradeTimeStr);
                const channelString = `0~${exchange}~${fromSymbol}~${toSymbol}`;
                const subscriptionItem = channelToSubscription.get(channelString);
                if (subscriptionItem === undefined) {
                    return;
                }
                const lastDailyBar = subscriptionItem.lastDailyBar;
                const nextDailyBarTime = getNextDailyBarTime(JSON.parse(Cookies.get('lastBarSpot'))?.time);

                let bar;
                if (tradeTime >= nextDailyBarTime) {
                    bar = {
                        time: nextDailyBarTime,
                        open: tradePrice,
                        high: tradePrice,
                        low: tradePrice,
                        close: tradePrice,
                    };
                    console.log('[socket] Generate new bar', bar);
                } else {
                    bar = {
                        ...JSON.parse(Cookies.get('lastBarSpot')),
                        high: Math.max(JSON.parse(Cookies.get('lastBarSpot'))?.high, tradePrice),
                        low: Math.min(JSON.parse(Cookies.get('lastBarSpot'))?.low, tradePrice),
                        close: tradePrice,
                    };
                    // console.log('[socket] Update the latest bar by price', tradePrice);
                }
                subscriptionItem.lastDailyBar = bar;

                // send data to every subscriber of that symbol
                subscriptionItem.handlers.forEach((handler) => handler.callback(bar));
            }
        };

        client.onclose = function (e) {
            console.log({ e });
            var i = 0;
            if (e.wasClean == true) {
                console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
            } else {
                i++;
                if (i < 10) {
                    setTimeout(function () {
                        console.log(
                            'Socket is closed. Reconnect will be attempted in 1 second.',
                            e.reason,
                        );
                        connect();
                    }, 1000);
                }
            }
        };

        client.onerror = function (err) {
            console.error('Socket encountered error: ', err.message, 'Closing socket');
            connect();
        };
    }
    if (client) {
        client.close();
        connect();
    } else {
        connect();
    }
}

export function unsubscribeFromStream(subscriberUID) {
    // find a subscription with id === subscriberUID
    for (const channelString of channelToSubscription.keys()) {
        const subscriptionItem = channelToSubscription.get(channelString);
        const handlerIndex = subscriptionItem.handlers.findIndex(
            (handler) => handler.id === subscriberUID,
        );

        if (handlerIndex !== -1) {
            // remove from handlers
            subscriptionItem.handlers.splice(handlerIndex, 1);

            if (subscriptionItem.handlers.length === 0) {
                // unsubscribe from the channel, if it was the last handler
                console.log(
                    '[unsubscribeBars]: Unsubscribe from streaming. Channel:',
                    channelString,
                );

                // socket.emit('SubRemove', { subs: [channelString] });
                channelToSubscription.delete(channelString);
                break;
            }
        }
    }
}

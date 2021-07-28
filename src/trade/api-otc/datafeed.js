// // import { setSymbolHelper } from 'src/utils/index.js';
// import api from '../../../gate/api';
// import Cookies from 'js-cookie';
// var first;
// import {
//     makeApiRequest,
//     generateSymbol,
//     parseFullSymbol,
//     handleSaveToPC,
//     makeApiRequestForChart,
// } from './helpers.js';
// import { subscribeOnStream, unsubscribeFromStream } from './stream.js';
// import { makeStore } from '@store/index';
// import { setLastOtcBar } from 'store/reducers/trade';
// const lastBarsCache = new Map();
// const Store = makeStore();
// const configurationData = {
//     supported_resolutions: ['1', '3', '5', '15', '30', '60', '120', '240', 'D', 'W'],
//     exchanges: [
//         {
//             value: 'Bitfinex',
//             name: 'Bitfinex',
//             desc: 'Bitfinex',
//         },
//         // {
//         //   // `exchange` argument for the `searchSymbols` method, if a user selects this exchange
//         //   value: "Kraken",

//         //   // filter name
//         //   name: "Kraken",

//         //   // full exchange name displayed in the filter popup
//         //   desc: "Kraken bitcoin exchange",
//         // },
//     ],
//     symbols_types: [
//         {
//             name: 'crypto',
//             // `symbolType` argument for the `searchSymbols` method, if a user selects this symbol type
//             value: 'crypto',
//         },
//     ],
// };

// async function getAllSymbols() {
//     const data = await makeApiRequest('data/v3/all/exchanges');
//     console.log('getAllSymbols -> data', data);
//     let allSymbols = [];

//     for (const exchange of configurationData.exchanges) {
//         const pairs = data.Data[exchange.value].pairs;
//         for (const leftPairPart of Object.keys(pairs)) {
//             const symbols = pairs[leftPairPart].map((rightPairPart) => {
//                 const symbol = generateSymbol(exchange.value, leftPairPart, rightPairPart);
//                 return {
//                     symbol: symbol.short,
//                     full_name: symbol.short,
//                     description: symbol.short,
//                     exchange: exchange.value,
//                     type: 'crypto',
//                 };
//             });
//             allSymbols = [...allSymbols, ...symbols];
//         }
//     }
//     return allSymbols;
// }

// export default {
//     onReady: (callback) => {
//         console.log('[onReady]: Method call');
//         setTimeout(() => callback(configurationData));
//     },

//     searchSymbols: async (userInput, exchange, symbolType, onResultReadyCallback) => {
//         const symbols = await getAllSymbols();
//         const newSymbols = symbols.filter((symbol) => {
//             const isExchangeValid = exchange === '' || symbol.exchange === exchange;
//             const isFullSymbolContainsInput =
//                 symbol.full_name.toLowerCase().indexOf(userInput.toLowerCase()) !== -1;
//             return isExchangeValid && isFullSymbolContainsInput;
//         });
//         onResultReadyCallback(newSymbols);
//     },

//     resolveSymbol: async (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
//         console.log('[resolveSymbol]: Method call', symbolName);
//         const symbols = await getAllSymbols();
//         const symbolItem = symbols.find(({ full_name }) => full_name === symbolName);
//         if (!symbolItem) {
//             console.log('[resolveSymbol]: Cannot resolve symbol', symbolName);
//             onResolveErrorCallback('cannot resolve symbol');
//             return;
//         }
//         var split_data = symbolName.split(/[:/]/);
//         const symbolInfo = {
//             name: symbolItem.symbol,
//             description: symbolItem.description,
//             type: symbolItem.type,
//             session: '24x7',
//             timezone: 'Etc/UTC',
//             exchange: symbolItem.exchange,
//             minmov: 1,
//             pricescale: 100000000,
//             has_intraday: true,
//             intraday_multipliers: ['1', '60'],
//             supported_resolutions: configurationData.supported_resolutions,
//             volume_precision: 8,
//             data_status: 'streaming',
//         };
//         if (split_data[1].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
//             symbolInfo.pricescale = 100;
//         }
//         console.log('[resolveSymbol]: Symbol resolved', symbolName);
//         setTimeout(() => {
//             onSymbolResolvedCallback(symbolInfo);
//         }, 0);
//     },

//     getBars: async (
//         symbolInfo,
//         resolution,
//         from,
//         to,
//         onHistoryCallback,
//         onErrorCallback,
//         firstDataRequest,
//         limit,
//     ) => {
//         // console.log({ ...symbolInfo.base_name });
//         // setSymbolHelper('aaa');
//         localStorage.setItem('symbol', symbolInfo.base_name[0]);
//         console.log('[getBars]: Method call', symbolInfo, resolution, from, to);
//         const parsedSymbol = parseFullSymbol(symbolInfo.full_name);
//         const urlParameters = {
//             e: parsedSymbol.exchange,
//             fsym: parsedSymbol.fromSymbol,
//             tsym: parsedSymbol.toSymbol,
//             toTs: to,
//             limit: limit ? limit : 2000,
//         };
//         const query = Object.keys(urlParameters)
//             .map((name) => `${name}=${encodeURIComponent(urlParameters[name])}`)
//             .join('&');
//         console.log('query', query);
//         const url =
//             resolution === 'D' || resolution === '1D'
//                 ? 'group=day'
//                 : resolution >= 60
//                 ? 'group=hour'
//                 : 'group=minute';
//         console.log('resolution', resolution);
//         try {
//             const body = {
//                 "symbol": `${parsedSymbol.fromSymbol}${parsedSymbol.toSymbol}`,
//                 "from_date": to,
//                 "timeframe":  resolution === 'D' || resolution === '1D'
//                 ? 24 | 0x4000
//                 : resolution >= 60
//                 ? 1  | 0x4000
//                 : 1,
//                 "ticks": limit ? limit : 2000,
//             }
//             const data = await makeApiRequestForChart(body);
//             console.log('data', data);
//             if (data?.data.result?.data.length === 0) {
//                 // "noData" should be set if there is no data in the requested period.
//                 onHistoryCallback([], {
//                     noData: true,
//                 });
//                 return;
//             }
//             let bars = [];

//             data?.data.result?.data.forEach((bar, i, array) => {
//                 if (bar.time >= from && bar.time < to) {
//                     bars = [
//                         ...bars,
//                         {
//                             time: bar.time * 1000,
//                             low: bar.low,
//                             high: bar.high,
//                             open: bar.open,
//                             close: bar.close,
//                             volume: bar.tick_volume,
//                         },
//                     ];
//                 }
//             });

//             if (bars.length !== 0) {
//                 onHistoryCallback(bars, {
//                     noData: false,
//                 });
//             } else {
//                 onHistoryCallback([], {
//                     noData: true,
//                 });
//             }

//             if (firstDataRequest) {
//                 // lastBarsCache.set(symbolInfo.full_name, {
//                 //     ...bars[bars.length - 1],
//                 // });
//                 // Cookies.set(symbolInfo.full_name, {
//                 //     ...bars[bars.length - 1],
//                 // });
//                 localStorage.setItem('lastBarOtc', JSON.stringify({
//                     ...bars[bars.length - 1],
//                 }));
//                 // Store.dispatch(
//                 //     setLastOtcBar({
//                 //         ...bars[bars.length - 1],
//                 //     }),
//                 // );
//             }
           

            
           
//             console.log('dataaaaa', data)
//             console.log(`[getBars]: returned ${bars.length} bar(s)`);
//         } catch (error) {
//             console.log('[getBars]: Get error', error);
//             onErrorCallback(error);
//         }
//     },

//     subscribeBars: async (
//         symbolInfo,
//         resolution,
//         onRealtimeCallback,
//         subscribeUID,
//         onResetCacheNeededCallback,
//     ) => {
//         console.log('[subscribeBars]: Method call with subscribeUID:', symbolInfo);
//         let lastBarinStorage;
//         // window.addEventListener('storage', () => {
//         //     console.log('i got it', JSON.parse(localStorage.getItem('lastBarOtc')));
//         //   });
//         lastBarinStorage =  localStorage.getItem('lastBarOtc');

        
//         console.log('finlaly lastt bar is ', lastBarinStorage)
//         subscribeOnStream(
//             symbolInfo,
//             resolution,
//             onRealtimeCallback,
//             subscribeUID,
//             onResetCacheNeededCallback,
//             // lastBarsCache.get(symbolInfo.full_name),
//             JSON.parse(lastBarinStorage && lastBarinStorage),
//         );
//     },

//     unsubscribeBars: (subscriberUID) => {
        
//         console.log('[unsubscribeBars]: Method call with subscriberUID:', subscriberUID);
//         unsubscribeFromStream(subscriberUID);
//     },
//     calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
//         //optional
//         // console.log('=====calculateHistoryDepth running')
//         // while optional, this makes sure we request 24 hours of minute data at a time
//         // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
//         return resolution < 60 ? { resolutionBack: 'D', intervalBack: '1' } : undefined;
//     },
//     getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
//         //optional
//         // console.log('=====getMarks running')
//     },
//     getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
//         //optional
//         // console.log('=====getTimeScaleMarks running')
//     },
//     getServerTime: (cb) => {
//         // console.log('=====getServerTime running')
//     },
// };

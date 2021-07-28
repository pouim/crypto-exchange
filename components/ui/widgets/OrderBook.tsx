import { useMutation } from 'react-query';
import gate from 'gate/index';
import styles from './styles.module.css';
import { useGetUserWallet } from 'hooks/hooks';
import { generateCoinSymbol, generateCoinSymbolOneWay } from 'src/utils';
import { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currentCoinPath } from '@store/selectors/coin';
import { ComboBox } from '..';
import useTranslation from 'next-translate/useTranslation';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Menu from 'assets/svg/menu.svg';
import Cookies from 'js-cookie';
import { spread } from 'lodash';
import { setCurrentSymbol } from '@store/reducers/appearance';

interface Props {
    noDropDown?: boolean;
    noCaption?: boolean;
}

var send: any;
var client: any;
const OrderBook: FC<Props> = ({ noDropDown = false, noCaption }) => {
    const { mutate: getOrders, data } = useMutation(gate.getSymbolOrders);
    const { data: coins, isLoading }: any = useGetUserWallet();
    const [asks, setAsks] = useState<any>([]);
    const [bids, setBids] = useState<any>([]);
    const coins_list = generateCoinSymbolOneWay(coins);
    const currentCoin: any = useSelector<any>(currentCoinPath);
    const { t } = useTranslation();
    const [Tasks, setTasks] = useState<any>(1);
    const [Tbids, setTbids] = useState<any>(1);

    const [lastData, setLastData] = useState<any>({ lastPrice: 0.0, spread: 0 });
    // const [spread, setSpread] = useState(-100);

    const dispatch = useDispatch();

    useEffect(() => {
        function connect() {
            const accessToken = Cookies.get('token');
            client = new W3CWebSocket(`${process.env.WS_BASE_URL}/?token=${accessToken}`);

            send = (symbol) => {
                const data = { 'action': 'subscribe', 'data': `orders-${symbol}` };
                if (client.readyState == 1) {
                    client.send(JSON.stringify(data));
                }
            };

            client.onopen = function () {
                console.log('order book Connected');
                send(currentCoin);
            };
            client.onerror = function () {
                console.log('notif error');
                setTimeout(function () {
                    send();
                }, 1000);
            };

            client.onmessage = function (message) {
                const msg = JSON.parse(message.data);

                console.log({msg});
                if (msg.model == 'orders' && msg?.data[0]?.side == 'SELL' || msg?.data[1]?.side == 'SELL') {
                    console.log('asks');
                    setAsks((prev: any) => [msg.data[0], ...prev.filter(ask => ask.price !== msg.data[0].price)]);
                    setTasks((t) => t + msg.data[0].total);
                } else if (msg.model == 'orders' && msg?.data[0]?.side == 'BUY' || msg?.data[1]?.side == 'BUY') {
                    console.log('bids');
                    setBids((prev: any) => [msg.data[0], ...prev.filter(bid => bid.price !== msg.data[0].price)])
                    setTbids((t) => t + msg.data[0].total);
                }

                if(msg.data[0].price) {
                    setLastData((prev: any) => ({
                        lastPrice: msg?.data[0]?.price,
                        spread: msg?.data[0]?.price - prev.lastPrice,
                    }));
                }


                //THE BEST WAY//


                // if (msg.model == 'orders' && msg.action === 'updated') {
                //     console.log('updatd');
                //     if (msg?.data.side === 'BUY') {
                //         setBids((prev: any) => [
                //             msg.data,
                //             ...prev.filter((bid) => bid.price !== msg.data.price),
                //         ]);
                //         setTbids((t) => t + msg.data.total);
                //     } else {
                //         setAsks((prev: any) => [
                //             msg.data,
                //             ...prev.filter((ask) => ask.price !== msg.data.price),
                //         ]);
                //         setTasks((t) => t + msg.data.total);
                //     }
                // } else {
                //     console.log('deleted');
                //     if (msg?.data.side === 'BUY') {
                //         setBids((prev: any) => [
                //             ...prev.filter((bid) => bid.price !== msg.data.price),
                //         ]);
                //         // setTbids((t) => t + msg.data.total)
                //     } else {
                //         setAsks((prev: any) => [
                //             ...prev.filter((ask) => ask.price !== msg.data.price),
                //         ]);
                //         // setTasks((t) => t + msg.data.total)
                //     }
                // }

                // if (msg.data.price) {
                //     setLastData((prev: any) => ({
                //         lastPrice: msg?.data?.price,
                //         spread: msg?.data?.price - prev.lastPrice,
                //     }));
                // }

              

                // if (askMsg.length !== 0) {
                //     setAsks((prev: any) => [
                //         askMsg[0],
                //         ...prev.filter((ask) => ask.price !== askMsg[0].price),
                //     ]);
                //     setTasks((t) => t + askMsg[0].total);
                // }

                // if (bidMsg.length !== 0) {
                //     bidMsg &&
                //         setBids((prev: any) => [
                //             bidMsg[0],
                //             ...prev.filter((bid) => bid.price !== bidMsg[0].price),
                //         ]);
                //     bidMsg && setTbids((t) => t + bidMsg[0].total);
                // }
            };
            client.onclose = function (e) {
                if (e.wasClean !== true) {
                    console.log(
                        'order book is closed. Reconnect will be attempted in 1 second.',
                        e.reason,
                    );
                    setTimeout(function () {
                        connect();
                    }, 1000);
                } else {
                    console.log('order book successful closed');
                }
            };
        }
        connect();
        return () => {
            console.log('object');
            if (client && client) {
                client.close(3002, 'reaseeeen');
            }
        };
    }, []);

    // TODO: setLastPrice not only on asks but also bids

    const handleChange = (coinNames) => {
        send(coinNames);
        getOrders(coinNames, {
            onSuccess: (data: any) => {
                setAsks(data.asks);
                setBids(data.bids);
                setTasks(data.asks.reduce((a, b) => +a + +b.total, 0));
                setTbids(data.bids.reduce((a, b) => +a + +b.total, 0));
                // setLastPrice(data.asks?.[data.asks.length - 1]?.price);
                setLastData((prev: any) => ({
                    lastPrice: data.asks?.[data.asks.length - 1]?.price,
                    spread: 0,
                }));
            },
        });
        dispatch(setCurrentSymbol(coinNames));
        
    };

    useEffect(() => {
        console.log('WS connected');
        send(currentCoin);
        getOrders(currentCoin, {
            onSuccess: (data: any) => {
                console.log('orderbook data', data)
                setAsks(data.asks);
                setBids(data.bids);
                setTasks(data.asks.reduce((a, b) => +a + +b.total, 0));
                setTbids(data.bids.reduce((a, b) => +a + +b.total, 0));
                // setLastPrice(data.asks?.[data.asks.length - 1]?.price);
                // setLastData((prev: any) => {
                //     lastPrice: data.asks?.[data.asks.length - 1]?.price,
                //     spread: 0,
                // })
                setLastData((prev: any) => ({
                    lastPrice: data.asks?.[data.asks.length - 1]?.price,
                    spread:
                        data.asks?.[data.asks.length - 1]?.price -
                        data.asks?.[data.asks.length - 2]?.price,
                }));
                // setSpread(
                //     data.asks?.[data.asks.length - 1]?.price -
                //         data.asks?.[data.asks.length - 2]?.price,
                // );
                console.log('dataaaa', data);
            },
        });
    }, [currentCoin]);

    const spreadColor = lastData.spread > 0 ? 'green' : lastData.spread === 0 ? '' : '#9F393B';
    return (
        <div
            // className={`${styles.parent} ${styles.odd} w-full px-3 flex flex-col justify-start h-content`}
            className={`${styles.parent} ${styles.odd} w-full px-3 flex flex-col justify-start h-content`}
        >
            <div className="px-4">
                {!noCaption && (
                    <div className="flex flex-row py-3 mb-2  justify-items-between items-center cursor-pointer dragMe">
                        <Menu className="w-3 h-3 fill-current text-green-white mr-2" />
                        <h1>{t('common:order-book')}</h1>
                    </div>
                )}

                {noDropDown == false && (
                    <ComboBox
                        wrapperClassName="w-40"
                        title={''}
                        defaultValue={currentCoin}
                        data={coins_list}
                        onSelectedItem={(item) => handleChange(item)}
                        isLoading={isLoading}
                        renderItem={(item) => {
                            return (
                                <div className="w-full h-full p-2 flex justify-start w- hover:bg-c-secondary-900 transition-all duration-300">
                                    {item}
                                </div>
                            );
                        }}
                        name="provinceId"
                    />
                )}
            </div>
            {/* <div className="bg-main w-full p-1 items-center flex justify-between my-3 shadow">
                <span className="text-xs">{t('common:sell')}</span>
            </div> */}

            <div className="w-full text-gray-400 flex justify-between mt-3">
                {/* <small className="w-full text-center">Side</small> */}
                <small className="w-full text-center">{t('common:price')}</small>
                <small className="w-full text-center">{t('common:amount')}</small>
                <small className="w-full text-center">{t('common:total')}</small>
            </div>
            <div style={{ margin: 5 }} />
            <div
                className={`${styles.cdk_virtual_scroll_viewport} ${styles.info_table} hide-scrollbar`}
            >
                <ul className={`${styles.cdk_virtual_scroll_content_wrapper} hide-scrollbar`}>
                    {asks.length !== 0 ? (
                        asks
                            ?.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
                            .map((o: any) => (
                                <li
                                    key={o?.price + 'asaasaccxzxc'}
                                    className="border-b-2 border-gray-600 shadow-lg hover:bg-main hover:opacity-70 py-1 transition-all orderbookitem"
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            width: `${(o?.total / Tasks) * 100}%`,
                                            height: 20,
                                            backgroundColor: 'rgb(250,0,0,0.1)',
                                            // borderRadius: 50,
                                        }}
                                    ></div>
                                    <div className="flex justify-around z-10 text-red-200">
                                        {/* <small
                                            className={`w-full text-center cursor-pointer ${
                                                o.side == 'SELL'
                                                    ? 'text-red-500'
                                                    : 'text-main-green'
                                            }`}
                                        >
                                            {o.side}
                                        </small> */}
                                        <small className="w-full text-center">{o?.price}</small>
                                        <small className="w-full text-center">{o?.amount}</small>
                                        <small className="w-full text-center">{o?.total}</small>
                                    </div>
                                </li>
                            ))
                    ) : (
                        <div className="text-gray-400 py-5 w-full justify-center text-center">
                            {t('common:nodata')}
                        </div>
                    )}

                    {/* <div style={{ margin: 5 }} /> */}
                    <div className="my-3">
                        <div className="bg-main w-full p-2 items-center flex flex-row justify-between  shadow flex">
                            <small>{t('common:lastmarketprice')}</small>
                            <div style={{ flex: 1 }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        fontSize: '20px',
                                    }}
                                >
                                    <small>{lastData.lastPrice}</small>
                                    <div style={{ margin: 5 }} />
                                    <small>{currentCoin.split('-')[1]}</small>
                                </div>
                            </div>
                        </div>
                        <div className="bg-main w-full p-2 items-center flex flex-row justify-between  shadow flex">
                            <small>Spread</small>
                            <div style={{ flex: 1 }} />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', flexDirection: 'row' }}>
                                    <small
                                        style={{
                                            fontSize: 14,
                                            color: spreadColor,
                                            marginRight: '4rem',
                                        }}
                                    >
                                        {lastData.spread}
                                    </small>
                                    {/* <div style={{ margin: 5 }} />
                                <small>{currentCoin.split('-')[1]}</small> */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div style={{ margin: 5 }} /> */}

                    {/* <div className="bg-main w-full p-1 items-center flex justify-between my-3 shadow">
                        <span className="text-xs">{t('common:buy')}</span>
                    </div> */}

                    {bids.length !== 0 ? (
                        bids
                            ?.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
                            .map((o: any) => (
                                <li className="border-b-2 border-gray-600 shadow-lg hover:bg-main hover:opacity-70 py-1 transition-all">
                                    <div
                                        style={{
                                            position: 'absolute',
                                            width: `${(o?.total / Tbids) * 100}%`,
                                            height: 20,
                                            backgroundColor: 'rgb(0,255,0,0.1)',
                                            // borderRadius: 50,
                                        }}
                                    ></div>
                                    <div className="flex justify-around z-10 text-green-100">
                                        {/* <small className="cursor-pointer text-main-green w-full text-center">
                                            {o?.side}
                                        </small> */}
                                        <small className="w-full text-center">{o?.price}</small>
                                        <small className="w-full text-center">{o?.amount}</small>
                                        <small className="w-full text-center">{o?.total}</small>
                                    </div>
                                </li>
                            ))
                    ) : (
                        <div className="text-gray-400 py-5 w-full justify-center text-center">
                            {t('common:nodata')}
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default OrderBook;

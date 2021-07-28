import { FC, useEffect, useState } from 'react';
import gate from '@gate/index';
import { ResTradeHistory } from '@interfaces/index';
import { useGetUserWallet } from 'hooks/hooks';
import { useMutation } from 'react-query';
import styles from './styles.module.css';
import { generateCoinSymbol, generateCoinSymbolOneWay } from 'src/utils/index';
import { useSelector } from 'react-redux';
import { currentCoinPath } from '@store/selectors/coin';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Cookies from 'js-cookie';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    noDropDown?: boolean;
    hasCaption?: boolean;
}

const accessToken = Cookies.get('token');
const client = new W3CWebSocket(`${process.env.WS_BASE_URL}/?token=${accessToken}`);

const TradeHistory: FC<Props> = ({ noDropDown = false, hasCaption }) => {
    const { data: coins }: any = useGetUserWallet();
    const { mutate: getHistory } = useMutation(gate.tradeHistory, { retry: 1 });
    const [history, setHistory] = useState<any>([]);
    const currentCoin = useSelector(currentCoinPath);
    const { t } = useTranslation();

    // WEBSOCKET

    useEffect(() => {
        console.log(currentCoin);
        getHistory(currentCoin, {
            onSuccess: (data) => {
                setHistory(data);
            },
        });

        setTimeout(() => {
            send(currentCoin);
        }, 1000);

        client.onmessage = (message) => {
            console.log({ message });
            const msg = JSON.parse(message.data);
            console.log({ msg });
            if (msg.model == 'history') {
                setHistory((prev) => [msg.data, ...prev]);
            }
        };
    }, []);

    useEffect(() => {
        console.log('WS connected');
        send(currentCoin);
        getHistory(currentCoin, {
            onSuccess: (data) => {
                setHistory(data);
            },
        });
    }, [currentCoin]);

    const send = (symbol) => {
        const data = { 'action': 'subscribe', 'data': `history-${symbol}` };
        if (client.readyState == 1) {
            client.send(JSON.stringify(data));
        }
    };

    const handleChange = (e) => {
        send(e.target.value);
        getHistory(e.target.value, {
            onSuccess: (data) => setHistory(data),
        });
    };
    console.log('history', { history });
    const coins_data = generateCoinSymbolOneWay(coins);
    return (
        <div className={`${styles.parent} scrollbar-none`}>
            <div>
                {hasCaption && <h1 className="px-4 pb-4 pt-1 w-full">{t('common:trade-history')}</h1>}
                {noDropDown == false && (
                    <label className="block w-44 px-3">
                        <select
                            className="form-select bg-c-secondary-700 p-1 block w-full mt-1 bg-transparent rounded-3xl outline-none"
                            onChange={handleChange}
                        >
                            {coins_data?.map((c) => {
                                if (c) {
                                    return <option>{c}</option>;
                                }
                            })}
                        </select>
                    </label>
                )}
            </div>
            {/* <hr className="my-3" /> */}
            <div style={{ margin: 5 }} />
            {console.log(history)}

            <div className="w-full text-gray-400 px-10 grid grid-cols-4 text-center justify-center">
                <small style={{ fontWeight: 'bold' }}>{t('common:date')}</small>
                <small style={{ fontWeight: 'bold' }}>{t('common:side')}</small>
                <small style={{ fontWeight: 'bold' }}>{t('common:price')}</small>
                {/* <small>Total</small> */}
                <small style={{ fontWeight: 'bold' }}>{t('common:amount')}</small>
            </div>
            <div style={{ margin: 5 }} />
            <div
                className={`${styles.cdk_virtual_scroll_viewport} ${styles.info_table} hide-scrollbar`}
            >
                <ul className={`${styles.cdk_virtual_scroll_content_wrapper} hide-scrollbar`}>
                    {history?.map((h) => (
                        <li className="hover:bg-main hover:opacity-70 py-1 px-10 transition-all">
                            <div className="w-full grid grid-cols-4 text-center justify-center text-gray-400">
                                <small>{h?.time?.replace('T', ' ').split('.').splice(0, 1).join(' → ')}</small>
                                <small
                                    className={`cursor-pointer ${
                                        h?.side == 'SELL' ? 'text-red-500' : 'text-main-green'
                                    }`}
                                >
                                    {h.side}
                                </small>
                                <small>{h?.price}</small>
                                {/* <small>{h.total}</small> */}
                                <small>{h?.amount}</small>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TradeHistory;

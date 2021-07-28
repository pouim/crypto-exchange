import React, { FC, useState } from 'react';
import { queryClient } from 'pages/_app';
import dynamic from 'next/dynamic';
const DatePicker: any = dynamic(import('react-datepicker2'));
import { useGetMarketWatch, useGetOrders } from 'hooks/hooks';
import { useMutation, useQuery } from 'react-query';
import gate from '@gate/index';
import styles from './styles.module.css';
import useTranslation from 'next-translate/useTranslation';
import { useDispatch, useSelector } from 'react-redux';
import { currentCoinPath } from '@store/selectors/coin';
import Arrowsvg from 'assets/svg/arrowsvg.svg';
import Menu from 'assets/svg/menu.svg';
import { setCurrentSymbol } from '@store/reducers/appearance';



interface MarketWatchProps {
    noCaption?: boolean;
}
const MarketWatch:FC<MarketWatchProps> = ({noCaption}) => {
    const [created_at, setCreated_at] = useState({ after: '', befor: '' });
    const { mutate: getOrders } = useGetOrders();
    const [status, setStatus] = useState('FILLED');
    const { befor, after } = created_at;
    const { t } = useTranslation();
    const currentCoin = useSelector(currentCoinPath);

    const { data, isLoading }: any = useGetMarketWatch();

    const { mutate: paginateData } = useMutation(gate.paginateApi);

    const dispatch = useDispatch();

    const handleChange = (currentCoin) => {
        dispatch(setCurrentSymbol(currentCoin));
    };

    return (
        <div className={`${styles.parent} scrollbar-none`}>
            {!noCaption && (
                <div className="flex flex-row px-2 py-3 mb-2  justify-items-between items-center cursor-pointer dragMe">
                    <Menu className="w-3 h-3 fill-current text-green-white mr-2" />
                    <h1> {t('common:market-watch')}</h1>
                </div>
            )}

            <div className="h-full min-w-max">
                <div className={`w-full text-gray-400 flex justify-between`}>
                    <small className="w-full text-center">{t('common:pair')}</small>
                    <small className="w-full text-center">{t('common:price')}</small>
                    <small className="w-full text-center">{t('common:changes')}</small>
                </div>
                <div
                    className={`${styles.cdk_virtual_scroll_viewport} ${styles.info_table} hide-scrollbar`}
                >
                    <ul
                        className={`${styles.cdk_virtual_scroll_content_wrapper} ${styles.odd} hide-scrollbar`}
                    >
                        {data
                            ?.filter((item) => item.pair !== 'USD-USDT')
                            ?.map((item) => (
                                <div
                                    onClick={() => handleChange(item.pair)}
                                    className={`flex justify-around z-10 text-white hover:bg-main hover:opacity-70 py-3 transition-all cursor-pointer`}
                                >
                                    <small className="w-full text-center">{item.pair}</small>
                                    <small className="w-full text-center">{item.price}</small>
                                    <small
                                        style={{
                                            color:
                                                item.percent > 0
                                                    ? 'green'
                                                    : item.percent < 0
                                                    ? '#D82525'
                                                    : '#fff',
                                        }}
                                        className="w-full text-center"
                                    >
                                        {(item.percent * 100).toFixed(2)} {item.percent !== 0 && '%'}
                                    </small>
                                </div>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default MarketWatch;

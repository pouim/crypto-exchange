import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import withAuth from 'src/helpers/withAuth';
import React, { useEffect, useState } from 'react';
import OrderBook from 'components/ui/widgets/OrderBook';
import Assets from 'components/ui/widgets/Assets';
import OpenOrder from 'components/ui/widgets/OpenOrder';
import OrderHistory from 'components/ui/widgets/OrderHistory';
import TradingView from 'components/ui/widgets/TeadingView';
import Exchange from '@components/ui/widgets/Exchange/index';
import { getLayout } from '@components/common/Layout';
import { useGetUserWallet, useWindowDimensions } from 'hooks/hooks';
import { generateCoinSymbol, generateCoinSymbolOneWay } from 'src/utils';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentSymbol } from 'store/reducers/appearance';
import { currentCoinPath } from '@store/selectors/coin';
import { Tabs } from '@components/ui';
import styles from '../dashboard/styles.module.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import useTranslation from 'next-translate/useTranslation';
import TradeHistory from '@components/ui/widgets/TradeHistory';
import Menu from 'assets/svg/menu.svg';
import MarketWatch from '@components/ui/widgets/MarketWatch';
const ResponsiveGridLayout = WidthProvider(Responsive);

const Trade = ({}) => {
    const [symbol, setSymbol] = useState('BTC/USD');
    const dispatch = useDispatch();
    const { data: coins, isLoading }: any = useGetUserWallet();
    const { height, width } = useWindowDimensions();
    const currentCoin: any = useSelector<any>(currentCoinPath);
    const originalLayouts: any = getFromLS('trade_layout') || {};
    const dir = useSelector((state: any) => state?.appearance?.dir);
    const [exKey, setExKey] = useState(1);
    const { t } = useTranslation();

    const [layouts, setLayout] = useState({
        'lg': [
            { 'i': 'a', 'x': 0, 'y': 0, 'w': 5, 'h': 4 },
            { 'i': 'b', 'x': 6, 'y': 0, 'w': 5, 'h': 2 },
            { 'i': 'd', 'x': 6, 'y': 10, 'w': 5, 'h': 2 },
            { 'i': 'e', 'x': 0, 'y': 10, 'w': 5, 'h': 2 },
        ],
        'md': [
            { 'w': 4, 'h': 3, 'x': 2, 'y': 0, 'i': 'a', 'moved': false, 'static': false },
            { 'w': 2, 'h': 3, 'x': 8, 'y': 0, 'i': 'b', 'moved': false, 'static': false },
            { 'w': 2, 'h': 6, 'x': 6, 'y': 0, 'i': 'c', 'moved': false, 'static': false },
            { 'w': 2, 'h': 3, 'x': 0, 'y': 0, 'i': 'd', 'moved': false, 'static': false },
            { 'w': 2, 'h': 3, 'x': 8, 'y': 3, 'i': 'f', 'moved': false, 'static': false },
            { 'w': 6, 'h': 3, 'x': 0, 'y': 3, 'i': 'e', 'moved': false, 'static': false },
        ],
        'sm': [
            { 'w': 3, 'h': 3, 'x': 0, 'y': 5, 'i': 'a', 'moved': false, 'static': false },
            { 'w': 3, 'h': 4, 'x': 3, 'y': 5, 'i': 'b', 'moved': false, 'static': false },
            { 'w': 6, 'h': 1, 'x': 0, 'y': 9, 'i': 'c', 'moved': false, 'static': false },
            { 'w': 6, 'h': 2, 'x': 0, 'y': 3, 'i': 'd', 'moved': false, 'static': false },
            { 'w': 1, 'h': 1, 'x': 0, 'y': 10, 'i': 'f', 'moved': false, 'static': false },
            { 'w': 6, 'h': 3, 'x': 0, 'y': 0, 'i': 'e', 'moved': false, 'static': false },
        ],
        'xs': [
            { 'w': 1, 'h': 4, 'x': 0, 'y': 2, 'i': 'a', 'moved': false, 'static': true },
            { 'w': 1, 'h': 2, 'x': 0, 'y': 6, 'i': 'b', 'moved': false, 'static': true },
            { 'w': 1, 'h': 1, 'x': 0, 'y': 10, 'i': 'c', 'moved': false, 'static': false },
            { 'w': 1, 'h': 2, 'x': 0, 'y': 8, 'i': 'd', 'moved': false, 'static': true },
            { 'w': 1, 'h': 1, 'x': 0, 'y': 11, 'i': 'f', 'moved': false, 'static': false },
            { 'w': 1, 'h': 2, 'x': 0, 'y': 0, 'i': 'e', 'moved': false, 'static': true },
        ],
        'xxs': [
            { 'w': 1, 'h': 4, 'x': 0, 'y': 2, 'i': 'a', 'moved': false, 'static': true },
            { 'w': 1, 'h': 2, 'x': 0, 'y': 6, 'i': 'b', 'moved': false, 'static': true },
            { 'w': 1, 'h': 1, 'x': 0, 'y': 10, 'i': 'c', 'moved': false, 'static': false },
            { 'w': 1, 'h': 2, 'x': 0, 'y': 8, 'i': 'd', 'moved': false, 'static': true },
            { 'w': 1, 'h': 1, 'x': 0, 'y': 11, 'i': 'f', 'moved': false, 'static': false },
            { 'w': 1, 'h': 2, 'x': 0, 'y': 0, 'i': 'e', 'moved': false, 'static': true },
        ],
    });

    const handleChange = (e) => {
        const currentCoin: any = e;
        const [coin, toCoin] = currentCoin.split('-');
        setSymbol(`${coin}/${toCoin}`);
        dispatch(setCurrentSymbol(currentCoin));
    };
    const coins_data = generateCoinSymbolOneWay(coins);

    //  NOTE should be get serverside props
    useEffect(() => {
        setTimeout(() => {
            setExKey(exKey + 1);
        }, 150);
    }, []);
    useEffect(() => {
        setTimeout(() => {
            setExKey(exKey + 1);
        }, 150);
    }, [width]);

    // NOTE new

    function getFromLS(key) {
        let ls = {};
        if (global.localStorage) {
            try {
                ls = JSON.parse(localStorage.getItem('trade_layout') || '{}');
            } catch (e) {
                /*Ignore*/
            }
        }
        return ls;
    }

    function saveToLS(value) {
        if (global.localStorage) {
            global.localStorage.setItem('trade_layout', JSON.stringify(value));
        }
    }

    useEffect(() => {
        if (Object.keys(originalLayouts).length !== 0) {
            setLayout(originalLayouts);
        }
    }, []);

    useEffect(() => {
        saveToLS(layouts);
    }, [layouts]);

    const onLayoutChange = (layout, newLayout) => {
        setLayout(newLayout);
    };

    return (
        <div
            className="bg-c-secondary-800 text-gray-300 min-w-full flex-row-reverse lg:flex justify-between min-h-screen"
            dir="ltr"
        >
            {width !== null && width >= 1024 && (
                <>
                    <div className="w-full">
                        <ResponsiveGridLayout
                            key={exKey}
                            style={{ width: '100%', backgroundColor: '#293843' }}
                            className="layout"
                            onLayoutChange={(layout, newLayout) =>
                                onLayoutChange(layout, newLayout)
                            }
                            layouts={layouts}
                            breakpoints={{ lg: 2000, md: 996, sm: 768, xs: 480, xxs: 0 }}
                            cols={{ lg: 12, md: 10, sm: 6, xs: 1, xxs: 1 }}
                            draggableHandle=".dragMe"
                        >
                            <div
                                className={`${styles['dashboard-wrapper']} py-3`}
                                key="a"
                                dir={dir}
                            >
                                <TradingView currentCoin={currentCoin} coinsList={coins_data} />
                            </div>
                            <div
                                className={`${styles['dashboard-wrapper']} overflow-auto scrollbar-none`}
                                // style={{ maxWidth: 250 }}
                                key="b"
                                dir={dir}
                            >
                                <Exchange />
                            </div>
                            <div
                                className={`${styles['dashboard-wrapper']} py-3`}
                                key="c"
                                dir={dir}
                            >
                                <OrderBook />
                            </div>
                            <div
                                className={`${styles['dashboard-wrapper']} py-3`}
                                key="d"
                                dir={dir}
                            >
                                <Assets />
                            </div>

                            <div
                                className={`${styles['dashboard-wrapper']} py-3`}
                                key="f"
                                dir={dir}
                            >
                                <MarketWatch />
                            </div>

                            <div className={`${styles['dashboard-wrapper']} p-0`} key="e" dir={dir}>
                                {/* <OrderHistory /> */}
                                <div className="flex flex-row px-2 py-3 mb-2  justify-items-between items-center cursor-pointer dragMe">
                                    <Menu className="w-3 h-3 fill-current text-green-white mr-2" />
                                </div>
                                <Tabs
                                    activeTabClassName="text-white border-b-2 border-main shadow-lg"
                                    defaultIndex={0}
                                    tabsClassName="mb-2"
                                    tabsNames={[
                                        t('common:open-orders'),
                                        // t('common:order-book'),
                                        t('common:order-history'),
                                        t('common:trade-history'),
                                    ]}
                                >
                                    <OpenOrder />
                                    {/* <OrderBook noDropDown /> */}
                                    <OrderHistory />
                                    <TradeHistory />
                                </Tabs>
                            </div>
                        </ResponsiveGridLayout>
                    </div>
                </>
            )}
            {width !== null && width < 1024 && (
                <div className="my-3">
                    <div className="h-80 mb-4">
                        <TradingView currentCoin={currentCoin} coinsList={coins_data} />
                    </div>
                    <Tabs
                        activeTabClassName="text-white border-white"
                        defaultIndex={0}
                        tabsClassName="mb-2 mt-12"
                        tabsNames={[
                            t('common:open-orders'),
                            t('common:assets'),
                            t('common:order-book'),
                            t('common:exchange'),
                            t('common:order-history'),
                            t('common:trade-history'),
                            t('common:market-watch'),
                        ]}
                    >
                        <div className="h-96">
                            <OpenOrder />
                        </div>
                        <div className="h-96">
                            <Assets isTradePage noCaption={true} />
                        </div>
                        <div className="h-96">
                            <OrderBook noDropDown noCaption={true} />
                        </div>
                        <div className="h-96">
                            <Exchange noCaption={true} />
                        </div>
                        <div className="h-96">
                            <OrderHistory />
                        </div>
                        <div className="h-96">
                            <TradeHistory />
                        </div>
                        <div className="h-96">
                            <MarketWatch noCaption={true} />
                        </div>
                    </Tabs>
                </div>
            )}
        </div>
    );
};

const _getLayout = (page) => getLayout(page, 'Trade | TalanExchange', true);

export default withAuth(Trade, _getLayout);

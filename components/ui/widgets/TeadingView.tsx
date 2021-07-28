import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ComboBox } from '..';
import { useDispatch } from 'react-redux';
import { setCurrentSymbol } from '@store/reducers/appearance';
import Menu from 'assets/svg/menu.svg';
const TVChartContainer: any = dynamic(() => import('components/ui/TradingView'), { ssr: false });

const TeadingView = ({ currentCoin, coinsList = [] }) => {
    const dispatch = useDispatch();
    const [symbol, setSymbol] = useState<any>('BTC/USDT');

    const handleChange = (e) => {
        const currentCoin: any = e;
        const [coin, toCoin] = currentCoin.split('-');
        setSymbol(`${coin}/${toCoin}`);
        dispatch(setCurrentSymbol(currentCoin));
    };

    useEffect(() => {
        handleChange(currentCoin);
    }, [currentCoin]);
    
    return (
        <div className="h-full px-2">
            <div className="flex flex-row px-2 py-3 mb-2  justify-items-between items-center cursor-pointer dragMe">
                <Menu className="w-3 h-3 fill-current text-green-white mr-2" />
                {coinsList.length !== 0 && (
                    <ComboBox
                        wrapperClassName="w-40 mb-2"
                        title={''}
                        defaultValue={currentCoin}
                        data={coinsList}
                        onSelectedItem={(item) => handleChange(item)}
                        isLoading={false}
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

            <div
                id="main-chart"
                className="h-full"
                style={{ height: coinsList.length !== 0 ? '90%' : '100%' }}
            >
                <div id="top-header-heigth" />
                <div className="relative h-full">
                    <TVChartContainer symbol={symbol} />
                    <div id={'tv-chart'} className={'TVChartContainer rounded-3xl h-full'} />
                </div>
            </div>
        </div>
    );
};

export default TeadingView;

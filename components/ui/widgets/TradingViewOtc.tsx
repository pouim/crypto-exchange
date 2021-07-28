import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { ComboBox } from '..';
import { useDispatch } from 'react-redux';
import { setCurrentSymbol } from '@store/reducers/appearance';
// const TVChartContainer: any = dynamic(() => import('components/ui/TradingView/TradinViewOtc'), { ssr: false });

const TeadingView = ({ currentCoin, coinsList = [] }) => {
    const dispatch = useDispatch();
    const [symbol, setSymbol] = useState('BTC/USD');

    const handleChange = (e) => {
        const currentCoin: any = e;
        const [coin, toCoin] = currentCoin.split('-');
        setSymbol(`${coin}/${toCoin}`);
        dispatch(setCurrentSymbol(currentCoin));
    };
    return (
        <div className="h-full px-2">
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

            <div
                id="main-chart"
                className="h-full"
                style={{ height: coinsList.length !== 0 ? '90%' : '100%' }}
            >
                <div id="top-header-heigth" />
                <div className="relative h-full">
                    {/* <TVChartContainer symbol={symbol} /> */}
                    <div id={'tv-chart'} className={'TVChartContainer rounded-3xl h-full'} />
                </div>
            </div>
        </div>
    );
};

export default TeadingView;

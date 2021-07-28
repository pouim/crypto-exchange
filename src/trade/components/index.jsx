import React, { useEffect, usedefaultProps, useState } from 'react';
import './index.css';
import Datafeed from '../api/datafeed';
import { widget } from '../lib/charting_library/charting_library.min';
import { TIME_FRAMES } from '../constants/constants';

function TVChartContainer({
    symbol,
    interval,
    containerId,
    libraryPath,
    chartsStorageUrl,
    chartsStorageApiVersion,
    clientId,
    userId,
    fullscreen,
    autosize,
    studiesOverrides,
    theme,
}) {
    const [state, setstate] = useState('');
    useEffect(() => {
        const height =
            document.getElementById('main-chart').clientHeight -
            document.getElementById('top-header-heigth').clientHeight;
        const width = document.getElementById('main-chart').clientWidth;
        const widgetOptions = {
            debug: false,
            symbol: symbol,
            datafeed: Datafeed,
            height: height,
            width: width,
            interval: interval,
            container_id: containerId,
            library_path: libraryPath,
            locale: 'en',
            disabled_features: ['hide_left_toolbar_by_default'],
            enabled_features: ['study_templates', 'use_localstorage_for_settings'],
            disabledDrawings: false,
            charts_storage_url: chartsStorageUrl,
            charts_storage_api_version: chartsStorageApiVersion,
            client_id: clientId,
            user_id: userId,
            fullscreen: fullscreen,
            time_frames: TIME_FRAMES,
            autosize: autosize,
            theme: theme,
            studies_overrides: studiesOverrides,
            overrides: {
                'mainSeriesProperties.showCountdown': false,
            },
        };
        const tvWidget = new widget(widgetOptions);
        setstate(tvWidget);

        tvWidget.onChartReady(() => {
            tvWidget
                .createButton()
                .attr('title', 'Select or Search Pairings')
                .addClass('apply-common-tooltip')
                .on('click', () => widget.chart().executeActionById('symbolSearch'))[0].innerHTML =
                'Pairings';
            tvWidget
                .createButton()
                .attr('title', 'Dark Mode')
                .addClass('apply-common-tooltip')
                .on('click', () => widget.changeTheme('Dark'))[0].innerHTML = 'Dark';
            tvWidget
                .createButton()
                .attr('title', 'Light Mode')
                .addClass('apply-common-tooltip')
                .on('click', () => widget.changeTheme('Light'))[0].innerHTML = 'Light';
        });
    }, []);
    useEffect(() => {
        if (state) state.chart().setSymbol(symbol);
    }, [symbol]);
    return <></>;
}

TVChartContainer.defaultProps = {
    symbol: 'BTC/USD',
    interval: '1D',
    containerId: 'tv-chart',
    libraryPath: '/lib/charting_library/',
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: false,
    studiesOverrides: {},
    theme: 'Dark',
};

export default TVChartContainer;

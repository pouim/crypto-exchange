import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import withAuth from 'src/helpers/withAuth';
import React, { useEffect, useState } from 'react';
import OrderBook from 'components/ui/widgets/OrderBook';
import Navigation from 'components/ui/widgets/Navigation';
import Assets from 'components/ui/widgets/Assets';
import OrderHistory from 'components/ui/widgets/OrderHistory';
import styles from './styles.module.css';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useSelector } from 'react-redux';
import { useWindowDimensions } from 'hooks/hooks';
import { queryClient } from 'pages/_app';
import { toast } from 'src/utils';
const ResponsiveGridLayout = WidthProvider(Responsive);
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Cookies from 'js-cookie';
import Banner from 'components/ui/widgets/Banner';
import HistoryPage from 'pages/history';

const accessToken = Cookies.get('token');
// const client = new W3CWebSocket(`${process.env.WS_BASE_URL}/?token=${accessToken}`);

const Dashboard = ({}) => {
    const originalLayouts: any = getFromLS('layoutsss') || {};
    const { height, width }: any = useWindowDimensions();

    const dir = useSelector((state: any) => state?.appearance?.dir);
    const [exKey, setExKey] = useState(1);

    const [layouts, setLayout] = useState(
        //     {
        //     'lg': [
        //         { 'i': 'a', 'x': 0, 'y': 0, 'w': 5, 'minW': 4, 'minH': 2, 'h': 4 },
        //         { 'i': 'b', 'x': 6, 'y': 0, 'w': 5, 'minW': 4, 'minH': 1, 'h': 2 },
        //         { 'i': 'd', 'x': 6, 'y': 10, 'w': 5, 'minW': 4, 'minH': 1, 'h': 2 },
        //         { 'i': 'e', 'x': 0, 'y': 10, 'w': 5, 'minW': 4, 'minH': 1, 'h': 2 },
        //         { 'i': 'f', 'x': 0, 'y': 0, 'w': 12, 'minW': 12, 'minH': 2, 'h': 2 },
        //     ],
        //     'md': [
        //         {
        //             'w': 5,
        //             'h': 4,
        //             'x': 0,
        //             'y': 0,
        //             'i': 'a',
        //             'minW': 4,
        //             'minH': 2,
        //             'moved': false,
        //             'static': false,
        //         },
        //         {
        //             'w': 5,
        //             'h': 2,
        //             'x': 5,
        //             'y': 0,
        //             'i': 'b',
        //             'minW': 4,
        //             'minH': 1,
        //             'moved': false,
        //             'static': false,
        //         },
        //         {
        //             'w': 5,
        //             'h': 2,
        //             'x': 5,
        //             'y': 2,
        //             'i': 'd',
        //             'minW': 4,
        //             'minH': 1,
        //             'moved': false,
        //             'static': false,
        //         },
        //         {
        //             'w': 10,
        //             'h': 2,
        //             'x': 0,
        //             'y': 4,
        //             'i': 'f',
        //             'minW': 12,
        //             'minH': 2,
        //             'moved': false,
        //             'static': false,
        //         },
        //     ],
        //     'sm': [
        //         { 'i': 'a', 'x': 0, 'y': 0, 'w': 12, 'minW': 4, 'minH': 2, 'h': 4 },
        //         { 'i': 'b', 'x': 0, 'y': 0, 'w': 12, 'minW': 4, 'minH': 1, 'h': 2 },
        //         { 'i': 'd', 'x': 0, 'y': 3, 'w': 12, 'minW': 4, 'minH': 1, 'h': 2 },
        //         { 'i': 'e', 'x': 0, 'y': 3, 'w': 12, 'minW': 4, 'minH': 1, 'h': 2 },
        //         { 'i': 'f', 'x': 0, 'y': 0, 'w': 12, 'minW': 12, 'minH': 2, 'h': 4 },
        //     ],
        //     'xs': [
        //         { 'w': 1, 'h': 4, 'x': 0, 'y': 12, 'i': 'a', 'moved': false, 'static': true },
        //         { 'w': 1, 'h': 2, 'x': 0, 'y': 16, 'i': 'b', 'moved': false, 'static': true },
        //         { 'w': 1, 'h': 2, 'x': 0, 'y': 18, 'i': 'd', 'moved': false, 'static': true },
        //         { 'w': 1, 'h': 12, 'x': 0, 'y': 0, 'i': 'f', 'moved': false, 'static': true },
        //     ],
        //     'xxs': [
        //         { 'i': 'a', 'x': 0, 'y': 0, 'w': 12, 'h': 4, 'static': true },
        //         { 'i': 'b', 'x': 0, 'y': 0, 'w': 12, 'h': 2, 'static': true },
        //         { 'i': 'd', 'x': 0, 'y': 0, 'w': 12, 'h': 2, 'static': true },
        //         { 'i': 'e', 'x': 0, 'y': 0, 'w': 12, 'h': 2, 'static': true },
        //         { 'i': 'f', 'x': 0, 'y': 0, 'w': 12, 'h': 4, 'static': true },
        //     ],
        // }
        {
            'lg': [
                { 'w': 12, 'h': 1, 'x': 0, 'y': 0, 'i': 'g', 'moved': false, 'static': false },
                { 'w': 6, 'h': 4, 'x': 0, 'y': 1, 'i': 'a', 'moved': false, 'static': false },
                { 'w': 6, 'h': 2, 'x': 6, 'y': 1, 'i': 'b', 'moved': false, 'static': false },
                { 'w': 6, 'h': 2, 'x': 6, 'y': 3, 'i': 'd', 'moved': false, 'static': false },
                { 'w': 12, 'h': 1, 'x': 0, 'y': 5, 'i': 'f', 'moved': false, 'static': false },
            ],
            'md': [
                { 'w': 12, 'h': 1, 'x': 0, 'y': 0, 'i': 'g', 'moved': false, 'static': false },
                { 'w': 6, 'h': 4, 'x': 0, 'y': 1, 'i': 'a', 'moved': false, 'static': false },
                { 'w': 6, 'h': 2, 'x': 6, 'y': 1, 'i': 'b', 'moved': false, 'static': false },
                { 'w': 6, 'h': 2, 'x': 6, 'y': 3, 'i': 'd', 'moved': false, 'static': false },
                { 'w': 12, 'h': 2, 'x': 0, 'y': 5, 'i': 'h', 'moved': false, 'static': false },
                { 'w': 12, 'h': 1, 'x': 0, 'y': 7, 'i': 'f', 'moved': false, 'static': false },
            ],
            'sm': [
                { 'w': 1, 'h': 1, 'x': 0, 'y': 0, 'i': 'g', 'moved': false, 'static': false },
                { 'w': 1, 'h': 2, 'x': 0, 'y': 1, 'i': 'a', 'moved': false, 'static': false },
                { 'w': 1, 'h': 2, 'x': 0, 'y': 3, 'i': 'b', 'moved': false, 'static': false },
                { 'w': 1, 'h': 2, 'x': 0, 'y': 5, 'i': 'd', 'moved': false, 'static': false },
                { 'w': 1, 'h': 1, 'x': 0, 'y': 8, 'i': 'h', 'moved': false, 'static': false },
                { 'w': 1, 'h': 1, 'x': 0, 'y': 7, 'i': 'f', 'moved': false, 'static': false },
            ],
            'xs': [
                { 'w': 1, 'h': 1, 'x': 0, 'y': 0, 'i': 'g', 'moved': false, 'static': false },
                { 'w': 1, 'h': 2, 'x': 0, 'y': 1, 'i': 'a', 'moved': false, 'static': false },
                { 'w': 1, 'h': 2, 'x': 0, 'y': 3, 'i': 'b', 'moved': false, 'static': false },
                { 'w': 1, 'h': 2, 'x': 0, 'y': 5, 'i': 'd', 'moved': false, 'static': false },
                { 'w': 1, 'h': 1, 'x': 0, 'y': 8, 'i': 'h', 'moved': false, 'static': false },
                { 'w': 1, 'h': 1, 'x': 0, 'y': 7, 'i': 'f', 'moved': false, 'static': false },
            ],
            'xxs': [
                { 'w': 1, 'h': 1, 'x': 0, 'y': 0, 'i': 'g', 'moved': false, 'static': false },
                { 'w': 1, 'h': 2, 'x': 0, 'y': 1, 'i': 'a', 'moved': false, 'static': false },
                { 'w': 1, 'h': 2, 'x': 0, 'y': 3, 'i': 'b', 'moved': false, 'static': false },
                { 'w': 1, 'h': 2, 'x': 0, 'y': 5, 'i': 'd', 'moved': false, 'static': false },
                { 'w': 1, 'h': 1, 'x': 0, 'y': 8, 'i': 'h', 'moved': false, 'static': false },
                { 'w': 1, 'h': 1, 'x': 0, 'y': 7, 'i': 'f', 'moved': false, 'static': false },
            ],
        },
        
    );

    // useEffect(() => {
    //     function connect() {
    //         const client = new W3CWebSocket(`${process.env.WS_BASE_URL}/?token=${accessToken}`);
    //         const sendNotif = () => {
    //             const data = { 'action': 'subscribe', 'data': 'notifications' };
    //             if (client.readyState == 1) {
    //                 client.send(JSON.stringify(data));
    //             }
    //         };

    //         client.onopen = function () {
    //             console.log('notif Connected');
    //             sendNotif();
    //         };

    //         client.onmessage = function (message) {
    //             const msg = JSON.parse(message.data);
    //             if (msg.model == 'notification') {
    //                 toast(msg.action, { gravity: 'top', position: 'left' });
    //                 queryClient.prefetchQuery('notifs');
    //                 queryClient.prefetchQuery('orders');
    //             }
    //         };
    //         client.onclose = function (e) {
    //             console.log('Notif is closed. Reconnect will be attempted in 1 second.', e.reason);
    //             setTimeout(function () {
    //                 connect();
    //             }, 1000);
    //         };
    //     }
    //     connect();
    // }, []);

    useEffect(() => {
        if (Object.keys(originalLayouts).length !== 0) {
            setLayout(originalLayouts);
        }
        setTimeout(() => {
            setExKey(exKey + 1);
        }, 150);
        // client.onopen = (e) => {
        //     sendNotif();
        //     console.log('Ws Connected');
        // };
        // client.onmessage = (message) => {
        //     const msg = JSON.parse(message.data);
        //     if (msg.model == 'notification') {
        //         toast(msg.action, { gravity: 'top', position: 'left' });
        //         queryClient.prefetchQuery('notifs');
        //         queryClient.prefetchQuery('orders');
        //     }
        // };

        // client.onclose = (e) => {
        //     console.log({ e });
        // };

        // return () => {
        //     client.close();
        // };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setExKey(exKey + 1);
        }, 200);
    }, [width && width]);

    function getFromLS(key) {
        let ls = {};
        if (global.localStorage) {
            try {
                ls = JSON.parse(localStorage.getItem('layoutsss') || '{}');
            } catch (e) {
                /*Ignore*/
            }
        }
        return ls;
    }

    function saveToLS(value) {
        if (global.localStorage) {
            global.localStorage.setItem('layoutsss', JSON.stringify(value));
        }
    }

    useEffect(() => {
        saveToLS(layouts);
    }, [layouts]);

    const onLayoutChange = (layout, newLayout) => {
        setLayout(newLayout);
    };

    return (
        <>
            <ResponsiveGridLayout
                style={{ width: '100%', backgroundColor: '#293843' }}
                className="layout transition-all"
                key={exKey}
                onLayoutChange={(layout, newLayout) => onLayoutChange(layout, newLayout)}
                layouts={layouts}
                breakpoints={{ lg: 2000, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 12, sm: 1, xs: 1, xxs: 1 }}
                draggableHandle=".dragMe"
            >
                <div className={`${styles['dashboard-wrapper']} scrollbar-none`} key="g" dir={dir}>
                    <Banner />
                </div>
                <div className={`${styles['dashboard-wrapper']} scrollbar-none`} key="a" dir={dir}>
                    <OrderBook />
                </div>
                <div className={`${styles['dashboard-wrapper']} scrollbar-none`} key="b" dir={dir}>
                    <Assets />
                </div>
                <div
                    className={`${styles['dashboard-wrapper']}  scrollbar-none  px-2`}
                    key="d"
                    dir={dir}
                >
                    <OrderHistory hasCaption={true} />
                </div>
                <div
                    className={`${styles['dashboard-wrapper']}  scrollbar-none  px-2`}
                    key="h"
                    dir={dir}
                >
                    <HistoryPage  />
                </div>
                <div className={`${styles['dashboard-wrapper']} scrollbar-none`} key="f" dir={dir}>
                    <Navigation />
                </div>
            </ResponsiveGridLayout>
        </>
    );
};

export default withAuth(Dashboard);
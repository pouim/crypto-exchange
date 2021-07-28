import React, { ReactNode, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BackDrop } from '@components/ui';
import { isSideBarNotifOpen } from 'store/reducers/appearance';
import styles from './styles.module.css';
import Close from 'assets/svg/close.svg';
import { useMutation, useQuery } from 'react-query';
import gate from '@gate/index';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Cookies from 'js-cookie';
import { queryClient } from 'pages/_app';
import { toast } from 'src/utils';
import useTranslation from 'next-translate/useTranslation';
import InfinitScroll from 'components/ui/infiniteScroll';
import NotificationIcon from 'assets/svg/notification.svg';
import ExchangeIcon from 'assets/svg/exchange.svg';

const Notification = () => {
    const { t } = useTranslation();
    const notifSideBar = useSelector((state: any) => state?.appearance?.notifSideBar);
    const dir = useSelector((state: any) => state?.appearance?.dir);
    const dispatch = useDispatch();

    useEffect(() => {
        function connect() {
            const accessToken = Cookies.get('token');
            const client = new W3CWebSocket(`${process.env.WS_BASE_URL}/?token=${accessToken}`);
            const sendNotif = () => {
                const data = { 'action': 'subscribe', 'data': 'notifications' };
                if (client.readyState == 1) {
                    client.send(JSON.stringify(data));
                }
            };

            client.onopen = function () {
                console.log('notif Connected');
                sendNotif();
            };
            client.onerror = function () {
                console.log('notif error');
                setTimeout(function () {
                    sendNotif();
                }, 2000);
            };

            client.onmessage = function (message) {
                const msg = JSON.parse(message.data);
                if (msg.model == 'notification') {
                    // toast(msg.action, { gravity: 'top', position: 'left' });
                    toast(t(`common:${msg.action}`), { gravity: 'top', position: 'left' });
                    queryClient.prefetchQuery('notifs');
                    queryClient.prefetchQuery('orders');
                }
            };
            client.onclose = function (e) {
                console.log({ e });
                if (e.wasClean == true) {
                    console.log(
                        'Notif is closed. Reconnect will be attempted in 2 second.',
                        e.reason,
                    );
                } else {
                    setTimeout(function () {
                        connect();
                    }, 2000);
                }
            };
        }
        connect();
    }, []);

    return (
        <>
            {notifSideBar == 'OPEN' && (
                <BackDrop
                    click={() => {
                        dispatch(isSideBarNotifOpen('CLOSE'));
                    }}
                />
            )}

            <div
                className={`fixed bg-c-secondary-900 ${
                    dir == 'ltr' ? 'right-0' : 'left-0'
                } shadow-lg ${styles.sidenav} ${
                    notifSideBar == 'OPEN'
                        ? styles.open
                        : `
                         ${dir == 'rtl' ? styles.close_rtl : styles.close_ltr}
                          }`
                } transition-all
                `}
                style={{ width: 300 }}
            >
                <div
                    className={`overflow-x-hidden bg-c-secondary-900  transition-all duration-75 overscroll-y-auto h-screen top-0 sticky hide-scrollbar`}
                >
                    <div className="h-24">
                        {notifSideBar == 'OPEN' && (
                            <div className="w-full flex justify-start h-24 items-center text-xl">
                                <Close
                                    className="w-5 h-5 fill-current text-muted mx-3 cursor-pointer"
                                    onClick={() => dispatch(isSideBarNotifOpen('CLOSE'))}
                                />
                            </div>
                        )}
                    </div>
                    {/* <small onClick={()=>notifs.set([...msg, notifs]);}>assa</small> */}
                    <div className="border-b-2 border-muted-900 my-3" />
                    <InfinitScroll
                        name="Notif"
                        fetchDataFn={gate.notifications}
                        renderItem={(data, i) => (
                            <>
                                {/* {data?.map((n: any) => ( */}
                                <>
                                    <div
                                        key={data?.actor?.created_at}
                                        className="bg-c-secondary-900  hover:opacity-95  px-5 py-2 flex flex-col"
                                    >
                                        <div className="flex flex-col justify-between items-center my-2 ">
                                            <small className="flex items-center w-full">
                                                {/* <span className="p-0">Verb : </span> */}
                                                {data?.verb == 'ORDER_FILLED' ||
                                                data?.verb == 'ORDER_PARTIALY_FILLED' ? (
                                                    <ExchangeIcon
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                        }}
                                                        className="fill-current text-red-600"
                                                    />
                                                ) : (
                                                    <NotificationIcon
                                                        style={{
                                                            width: 20,
                                                            height: 20,
                                                        }}
                                                        className="fill-current text-green-600"
                                                    />
                                                )}
                                                <div style={{ margin: 2 }} />
                                                <small
                                                    className={
                                                        data?.verb !== 'NEW_TICKET_MESSAGE'
                                                            ? 'text-red-600'
                                                            : 'text-green-600'
                                                    }
                                                    style={{ fontWeight: 'bold', fontSize: 18 }}
                                                >
                                                    {t(`common:${data?.verb}`)}
                                                </small>
                                            </small>
                                            <span className="mx-5" />
                                            {data?.actor?.created_at && (
                                                <small className="flex justify-start items-center w-full">
                                                    {/* <span className="p-0">Created At:</span> */}
                                                    <small className="text-white-600">
                                                        {data?.actor?.created_at?.split('T')[0]}
                                                    </small>
                                                    <span> </span>
                                                    <small className="text-white-600">
                                                        {data?.actor?.created_at
                                                            ?.split('T')[1]
                                                            ?.substring(0, 8)}
                                                    </small>
                                                </small>
                                            )}
                                        </div>

                                        <div className="w-full flex flex-col justify-between">
                                            {data?.actor?.base_coin && (
                                                <div className="flex justify-between items-center w-full">
                                                    <small>{t('common:from')}:</small>
                                                    <small>{data?.actor?.base_coin?.symbol}</small>
                                                </div>
                                            )}
                                            {data?.actor?.quote_coin && (
                                                <div className="flex justify-between items-center w-full">
                                                    <small>{t('common:to')}:</small>
                                                    <small>{data?.actor?.quote_coin?.symbol}</small>
                                                </div>
                                            )}
                                            {data?.actor?.price && (
                                                <div className="flex justify-between items-center w-full">
                                                    <small>{t('common:price')}</small>
                                                    <small>{data?.actor?.price}</small>
                                                </div>
                                            )}
                                            {data?.actor?.total && (
                                                <div className="flex justify-between items-center w-full">
                                                    <small>{t('common:total')}</small>
                                                    <small>{data?.actor?.total}</small>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="border-b-2 border-muted-900 my-3" />
                                </>
                            </>
                        )}
                    />
                </div>
            </div>
        </>
    );
};

export default Notification;

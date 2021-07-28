import React, { FC, useState } from 'react';
import dynamic from 'next/dynamic';
import Calendar from 'assets/svg/calendar.svg';
const DatePicker: any = dynamic(import('react-datepicker2'));
import styles from './styles.module.css';
import { useGetOrders } from 'hooks/hooks';
import { Orders } from '@interfaces/index';
import { useMutation, useQuery } from 'react-query';
import gate from '@gate/index';
import { queryClient } from 'pages/_app';
import useTranslation from 'next-translate/useTranslation';
import { toast } from 'react-toastify';


interface FilledOrderProps {
    hasCaption?: boolean;
}

const FiledOrder: FC<FilledOrderProps> = ({hasCaption}) => {
    const [created_at, setCreated_at] = useState({ after: '', befor: '' });
    const { mutate: cancelOrder } = useMutation(gate.cancelOrder);
    const { befor, after } = created_at;
    const { t } = useTranslation();
    const date = new Date();
    const currentDate = date.toISOString().split('T')[0];
    const { data }: any = useQuery(
        'orders',
        () =>
            gate.getOpenOrders({
                created_at_after: currentDate,
                created_at_before: befor,
            }),
        {
            retry: 1,
            refetchOnWindowFocus: false,
        },
    );

    const handleCancelOrder = (id) => {
        console.log(id);
        cancelOrder(
            { id: id },
            {
                onSuccess: () => {
                    queryClient.prefetchQuery('orders');
                    queryClient.prefetchQuery('user-wallet');
                },
                onError: (err: any) => {
                    toast.error(`${t('common:error')} ${err?.status}`);
                },
            },
        );
    };

    // const handleStatusChange = (status) => {
    //     cancelOrder(
    //         { id: id },
    //         {
    //             onSuccess: () => {
    //                 queryClient.prefetchQuery('orders');
    //             },
    //         },
    //     );
    // };

    const { mutate: getOrders } = useGetOrders();
    const orders: Orders[] = data;
    return (
        <div className={`${styles.parent} scrollbar-none`}>
            {hasCaption && (
                <h1 className="py-3 w-full px-4 justify-items-start flex ">
                    {t('common:open-orders')}
                </h1>
            )}
            <div className="flex justify-between">
                <div className="flex items-center">
                    <Calendar style={{ background: '#FFF' }} className="w-4 h-4 mx-2" />
                    <div className="mb-3 mx-2">
                        <DatePicker
                            timePicker={false}
                            isGregorian={true}
                            placeholder={t('common:date-from')}
                            className="z-100 bg-transparent w-24 text-center text-sm border-b border-gray-300 p-1 outline-none"
                            onChange={(value) => {
                                setCreated_at({ ...created_at, after: value.format('YYYY-M-D') });
                                getOrders(
                                    {
                                        created_at_after: value.format('YYYY-M-D'),
                                        created_at_before: befor !== null ? befor : '',
                                    },
                                    {
                                        onSuccess: (data) => {
                                            queryClient.setQueryData('orders', data);
                                        },
                                    },
                                );
                            }}
                        />
                    </div>
                    <div className="mb-3 mx-2">
                        <DatePicker
                            timePicker={false}
                            placeholder={t('common:date-to')}
                            isGregorian={true}
                            className="z-100 bg-transparent w-24 text-center text-sm border-b border-gray-300 p-1 outline-none"
                            onChange={(value) => {
                                setCreated_at({ ...created_at, befor: value.format('YYYY-M-D') });
                                getOrders(
                                    {
                                        created_at_before: value.format('YYYY-M-D'),
                                        created_at_after: after !== null ? after : '',
                                    },
                                    {
                                        onSuccess: (data) => {
                                            queryClient.setQueryData('orders', data);
                                        },
                                    },
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="h-full" style={{ minWidth: 500 }}>
                <div className="w-full flex justify-around text-gray-400 mb-2">
                    <small className="w-full text-center">{t('common:date')}</small>
                    <small className="w-full text-center">{t('common:pair')}</small>
                    <small className="w-full text-center">{t('common:type')}</small>
                    <small className="w-full text-center">{t('common:side')}</small>
                    <small className="w-full text-center">{t('common:price')}</small>
                    <small className="w-full text-center">{t('common:amount')}</small>
                    <small className="w-full text-center">{t('common:filled')}</small>
                    <small className="w-full text-center">{t('common:total')}</small>
                    {/* <small className="w-full text-center">
                    <label className="block px-3">
                        <select
                            // placeholder={currentCoin}
                            // defaultValue={currentCoin}
                            className="form-select bg-c-secondary-800 block rounded-md outline-none"
                            // onChange={handleChange}
                        >
                            <option value="asas">Filled</option>
                            <option value="asas">sasa</option>
                            <option value="asas">sasa</option>
                        </select>
                    </label>
                </small> */}
                    <small className="w-full text-center">Action</small>
                </div>
                <div
                    className={`${styles.cdk_virtual_scroll_viewport} ${styles.info_table} hide-scrollbar`}
                >
                    <ul
                        className={`${styles.cdk_virtual_scroll_content_wrapper} ${styles.odd} hide-scrollbar`}
                    >
                        {orders?.map((order) => (
                            <li
                                key={order.created_at}
                                className="hover:bg-c-secondary-800 py-1 transition-all"
                            >
                                <div className="flex justify-around">
                                    <small className="w-full text-center">
                                        {order.created_at?.split('T')[0]}
                                    </small>
                                    <small className="w-full text-center">{`${order?.base_coin?.symbol}/${order.quote_coin.symbol}`}</small>
                                    <small className="w-full text-center">{order.type}</small>
                                    <small
                                        className={`w-full text-center ${
                                            order.side == 'SELL'
                                                ? 'text-red-500'
                                                : 'text-main-green'
                                        }`}
                                    >
                                        {order.side}
                                    </small>

                                    <small className="w-full text-center">{order.price}</small>
                                    <small className="w-full text-center">{order.amount}</small>
                                    <small className="w-full text-center">{order.filled}%</small>
                                    <small className="w-full text-center">{order.total}</small>
                                    {/* <small className="w-full text-center">{order.status}</small> */}
                                    <small className="w-full text-center">
                                        <button
                                            className="border px-1 border-red-500 hover:bg-c-secondary-800 rounded-sm text-gray-300 bg-main"
                                            onClick={() => handleCancelOrder(order.id)}
                                        >
                                            {t('common:cancel')}
                                        </button>
                                    </small>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default FiledOrder;

import React, { FC, useState } from 'react';
import { queryClient } from 'pages/_app';
import dynamic from 'next/dynamic';
import Calendar from 'assets/svg/calendar.svg';
const DatePicker: any = dynamic(import('react-datepicker2'));
import { useGetOrders } from 'hooks/hooks';
import { useMutation, useQuery } from 'react-query';
import gate from '@gate/index';
import styles from './styles.module.css';
import useTranslation from 'next-translate/useTranslation';
import { useSelector } from 'react-redux';
import { currentCoinPath } from '@store/selectors/coin';
import Arrowsvg from 'assets/svg/arrowsvg.svg';
import Menu from 'assets/svg/menu.svg';

interface OrderHistoryProps {
    hasCaption?: boolean;
}


const OrderHistory: FC<OrderHistoryProps> = ({hasCaption}) => {
    const [created_at, setCreated_at] = useState({ after: '', befor: '' });
    const { mutate: getOrders } = useGetOrders();
    const [status, setStatus] = useState('FILLED');
    const { befor, after } = created_at;
    const { t } = useTranslation();
    const currentCoin = useSelector(currentCoinPath);

    const { data }: any = useQuery(
        'order_history',
        () => gate.getOrders({ status: status, created_at_after: after, created_at_before: befor }),
        {
            retry: 1,
        },
    );

    const { mutate: paginateData } = useMutation(gate.paginateApi);

    const orders: any = data;

    // NOTE ststus change
    const HandleChangeStatus = (status) => {
        setStatus(status);
        getOrders(
            { status: status, created_at_after: after, created_at_before: befor },
            {
                onSuccess: (data) => {
                    queryClient.setQueryData('order_history', data);
                },
            },
        );
    };

    return (
        <div className={`${styles.parent} scrollbar-none`}>
            {hasCaption && (
                <div className="flex flex-row px-2 py-3 mb-2  justify-items-between items-center cursor-pointer dragMe">
                    <Menu className="w-3 h-3 fill-current text-green-white mr-2" />
                    <h1> {t('common:order-history')}</h1>
                </div>
            )}

            <div className="flex justify-between">
                <div className="flex items-center">
                <Calendar style={{ background: '#FFF' }} className="w-4 h-4 mx-2" />
                    <div className="mb-3 mx-2">
                        <DatePicker
                            timePicker={false}
                            isGregorian={true}
                            placeholder={
                                created_at.after !== '' ? created_at.after : t('common:date-from')
                            }
                            className="bg-transparent w-24 text-center text-sm border-b border-gray-300 p-1 outline-none"
                            onChange={(value) => {
                                setCreated_at({ ...created_at, after: value.format('YYYY-M-D') });
                                getOrders(
                                    {
                                        created_at_after: value.format('YYYY-M-D'),
                                        status,
                                        created_at_before: befor !== 'Date to' ? befor : '',
                                    },
                                    {
                                        onSuccess: (data) => {
                                            queryClient.setQueryData('order_history', data);
                                        },
                                    },
                                );
                            }}
                        />
                    </div>
                    <div className="mb-3 mx-2">
                        <DatePicker
                            timePicker={false}
                            placeholder={
                                created_at.befor !== '' ? created_at.befor : t('common:date-to')
                            }
                            isGregorian={true}
                            className="bg-transparent w-24 text-center text-sm border-b border-gray-300 p-1 outline-none"
                            onChange={(value) => {
                                console.log({ value: value.format('YYYY-M-D') });
                                setCreated_at({
                                    ...created_at,
                                    befor: value.format('YYYY-M-D'),
                                });
                                getOrders(
                                    {
                                        created_at_before: value.format('YYYY-M-D'),
                                        status,
                                        created_at_after: after !== 'Date from' ? after : '',
                                    },
                                    {
                                        onSuccess: (data) => {
                                            queryClient.setQueryData('order_history', data);
                                        },
                                    },
                                );
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="h-full min-w-max">
                <div className={`${styles.grid_custom_cols_9} grid grid-cols-9 text-gray-400 mb-2`}>
                    <small className="w-full text-center">{t('common:date')}</small>
                    <small className="w-full text-center">{t('common:pair')}</small>
                    <small className="w-full text-center">{t('common:type')}</small>
                    <small className="w-full text-center">{t('common:side')}</small>
                    <small className="w-full text-center">{t('common:price')}</small>
                    <small className="w-full text-center">{t('common:amount')}</small>
                    <small className="w-full text-center">{t('common:filled')}</small>
                    <small className="w-full text-center">{t('common:total')}</small>
                    <small className="w-full text-center">
                        <label className="w-full text-center flex justify-center ">
                            <select
                                defaultValue={'Filled'}
                                className="form-select bg-c-secondary-800 rounded-md outline-none flex justify-center w-14 cursor-pointer"
                                onChange={(e) => HandleChangeStatus(e.target.value)}
                            >
                                <option value="FILLED">{t('common:filled')}</option>
                                <option value="PARTIALLY_FIELD">
                                    {t('common:partially-field')}
                                </option>
                                <option value="CANCELED">{t('common:canceled')}</option>
                                <option value="EXPIRED">{t('common:expred')}</option>
                            </select>
                        </label>
                    </small>
                </div>
                <div
                    className={`${styles.cdk_virtual_scroll_viewport} ${styles.info_table} hide-scrollbar`}
                >
                    <ul
                        className={`${styles.cdk_virtual_scroll_content_wrapper} ${styles.odd} hide-scrollbar`}
                    >
                        <div className="w-full flex justify-start">
                            <button
                                disabled={orders?.previous == null}
                                className={`${styles.btn} text-center bg-main rounded-full p-1 mx-1 shadow transition-all hover:bg-c-secondary-800 focus-within:outline-none focus:outline-none`}
                                onClick={() =>
                                    paginateData(
                                        { url: orders?.previous },
                                        {
                                            onSuccess: (data) => {
                                                queryClient.setQueryData('order_history', data);
                                            },
                                        },
                                    )
                                }
                            >
                                <Arrowsvg
                                    width={25}
                                    className="w-5 hover:bg-transparent h-5 fill-current mx-0 text-white cursor-pointer transform rotate-180"
                                />
                            </button>

                            <button
                                disabled={orders?.next == null}
                                className={`${styles.btn} text-center bg-main rounded-full p-1 mx-1 shadow transition-all hover:bg-c-secondary-800 focus-within:outline-none focus:outline-none`}
                                onClick={() =>
                                    paginateData(
                                        { url: orders?.next },
                                        {
                                            onSuccess: (data) => {
                                                queryClient.setQueryData('order_history', data);
                                            },
                                        },
                                    )
                                }
                            >
                                <Arrowsvg
                                    width={25}
                                    className="w-5 h-5 fill-current mx-0 hover:bg-transparent text-white cursor-pointer"
                                />
                            </button>
                        </div>
                        {orders?.results?.map((order) => (
                            <div
                                className={`${styles.grid_custom_cols_9} grid grid-cols-9 text-gray-400 mb-2`}
                            >
                                <small className="w-full text-center">
                                    {order.created_at?.split('T')[0]}
                                </small>
                                <small className="w-full text-center">{`${order?.base_coin?.symbol}/${order.quote_coin.symbol}`}</small>
                                <small className="w-full text-center">{order.type}</small>
                                <small
                                    className={`w-full text-center ${
                                        order.side == 'SELL' ? 'text-red-500' : 'text-main-green'
                                    }`}
                                >
                                    {order.side}
                                </small>
                                <small className="w-full text-center">{order.price}</small>
                                <small className="w-full text-center">{order.amount}</small>
                                <small className="w-full text-center">{order.filled}</small>
                                <small className="w-full text-center">{order.total}</small>
                                <small className="w-full text-center">{order.status}</small>
                            </div>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const DatePicker: any = dynamic(import('react-datepicker2'));
import styles from './styles.module.css';
import { useGetOrders } from 'hooks/hooks';
import { Orders } from '@interfaces/index';
import { useQuery } from 'react-query';
import gate from '@gate/index';
import { queryClient } from 'pages/_app';

const FiledOrder = () => {
    const [created_at, setCreated_at] = useState({ after: '', befor: '' });
    const { befor, after } = created_at;
    const { data }: any = useQuery(
        'orders',
        () => gate.getOrders({ created_at_after: after, created_at_before: befor }),
        {
            retry: 1,
        },
    );
    const { mutate: getOrders } = useGetOrders();
    const orders: Orders[] = data;

    return (
        <div className={`${styles.parent} scrollbar-none`}>
            <h1>Open Orders</h1>
            <div className="flex">
                <div className="mb-3 mx-2">
                    <small className="block text-gray-400">Date from</small>
                    <DatePicker
                        timePicker={false}
                        isGregorian={true}
                        className="bg-transparent w-24 text-center text-sm border-b border-gray-300 p-1 outline-none"
                        onChange={(value) => {
                            setCreated_at({ ...created_at, after: value.format('YYYY-M-D') });
                            getOrders(
                                {
                                    created_at_after: value.format('YYYY-M-D'),
                                    open: 'Yes',
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
                    <small className="block text-gray-400">Date from</small>
                    <DatePicker
                        timePicker={false}
                        isGregorian={true}
                        className="bg-transparent w-24 text-center text-sm border-b border-gray-300 p-1 outline-none"
                        onChange={(value) => {
                            setCreated_at({ ...created_at, befor: value.format('YYYY-M-D') });
                            getOrders(
                                {
                                    created_at_before: value.format('YYYY-M-D'),
                                    open: 'Yes',
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
            {/* <div className="flex my-2">
                <Button classBtn="p-2 w-28 mx-1 text-xs font-bold">Last 3 Days</Button>
                <Button classBtn="p-2 w-28 mx-1 text-xs font-bold">Last 3 Days</Button>
                <Button classBtn="p-2 w-28 mx-1 text-xs font-bold">Last 3 Days</Button>
            </div> */}
            <div className="w-full flex justify-around text-gray-400">
                <small>Time</small>
                <small>Side</small>
                <small>Price</small>
                <small>Pair</small>
                <small>Total</small>
            </div>
            <div
                className={`${styles.cdk_virtual_scroll_viewport} ${styles.info_table} hide-scrollbar`}
            >
                <ul className={`${styles.cdk_virtual_scroll_content_wrapper} hide-scrollbar`}>
                    {orders?.map((order) => (
                        <li
                            key={order.created_at}
                            className="hover:bg-main hover:opacity-70 py-1 transition-all"
                        >
                            <div className="flex justify-around">
                                <small className="cursor-pointer text-red-500">
                                    {order.created_at?.split('T')[0]}
                                </small>
                                <small>{order.side}</small>
                                <small>{order.price}</small>
                                <small>{order.pair}</small>
                                <small>{order.total}</small>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FiledOrder;

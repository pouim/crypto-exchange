import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import gate from '@gate/index';
import useTranslation from 'next-translate/useTranslation';
import { Button, Input, Tabs } from '@components/ui';
import { useForm } from 'react-hook-form';
import { getLayout } from '@components/common/Layout';
import withAuth from 'src/helpers/withAuth';
import { showError, toast } from 'src/utils';
import Assets from '@components/ui/widgets/Assets';
import Moment from 'react-moment';
const Withdraw = () => {
    const [page, setPage] = useState<1 | 2>(1);
    const { register, handleSubmit, reset, errors } = useForm();
    const { t } = useTranslation();
    const { data } = useQuery('withdraws', gate.withdraws, { retry: 1 });
    const withdrawsData: any = data;


    const router = useRouter();
    const  { id } :any  = router.query;
    const myID = id?.charAt(0)
    const symbol = id?.substring(1);
    const { mutate: reqWithdraw, isSuccess, isError, isLoading, error }: any = useMutation(
        gate.reqWithdraw,
    );
    console.log(error?.data[0]);
    const { mutate: withdraw } = useMutation(gate.withdraw);

    const onSubmit = (value): void => {
        // if (page == 1) {
        //     setPage(2);
        // }
        console.log(value);
        if (page == 1)
            reqWithdraw(
                { coin: myID, amount: value.amount, address: value.address },
                {
                    onSuccess: (d: any) => {
                        console.log(d);
                        setPage(2);
                    },
                    onError: (d: any) => {
                        console.log(d);
                        showError(d.data, { color: 'red', gravity: 'bottom', position: 'left' });
                    },
                },
            );
        else
            withdraw(
                { code: value.code, coin: myID, amount: value.amount, address: value.address },
                {
                    onSuccess: (d: any) => {
                        toast('your request has been successfully submitted', { color: 'green' });
                        setPage(1);
                        reset();
                    },
                    onError: (d: any) => {
                        console.log(d);
                    },
                },
            );
    };


    console.log('withdrawww', withdrawsData);
    console.log('idddd', id);

    return (
        <div className="flex flex-col w-full justify-center">
            <h1 style={{fontSize: '36px'}} className=" w-full justify-items-start flex px-2 py-5 ">
                {t('common:withdraw') + ' ' + 'for' + ' ' + symbol}
            </h1>
            <div>
                <div
                    style={{ margin: 'auto' }}
                    className="bg-main h-80 lg:w-100 py-5 px-2 w-full rounded-2xl flex items-center justify-between"
                >
                    <form
                        style={{ width: '45%' }}
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col items-center"
                    >
                        <Input
                            name="address"
                            placeholder="Address"
                            register={register({ required: t('common:cannot-be_empty') })}
                            error={errors.address}
                        />
                        <Input
                            name="amount"
                            placeholder="Amount"
                            type="number"
                            min={0}
                            error={errors.amount}
                            register={register({ required: t('common:cannot-be_empty') })}
                        />
                        {page == 2 && (
                            <Input
                                name="code"
                                type="number"
                                min={0}
                                placeholder="Code"
                                error={errors.code}
                                register={register({ required: t('common:cannot-be_empty') })}
                            />
                        )}
                        <div className="my-3 w-40">
                            <Button>Send</Button>
                        </div>
                        {error && (
                            <small className="bg-red-400 text-white rounded-lg p-1">
                                {error?.data[0]}
                            </small>
                        )}
                    </form>
                    <div className="w-1/2 h-full">
                        <Assets />
                    </div>
                </div>
            </div>

            <div className="lg: width: 80 w-full my-3">
                <Tabs
                    activeTabClassName="text-white border-white"
                    defaultIndex={0}
                    tabsClassName="lg:w-100 whitespace-nowrap"
                    tabsNames={[`${t('common:withdraw')} ${t('common:history')}`]}
                >
                    <div className="shadow-lg rounded-b-md overflow-hidden">
                        <div
                            className="w-full grid grid-cols-6 text-gray-200 px-2 py-3 text-center text-xs lg:text-sm"
                            style={{ backgroundColor: '#465d6f' }}
                        >
                            <span className="w-full">{t('common:date')}</span>
                            <span className="w-full">{t('common:coins')}</span>
                            <span className="w-full">{t('common:amount')}</span>
                            <span className="w-full">{t('common:Status')}</span>
                            <span className="w-full">{t('common:address')}</span>
                            <span className="w-full">{t('common:type')}</span>
                        </div>
                        <div
                            className="overflow-y-auto overflow-x-none max-h-96 custom_scrollbar
"
                            style={{ backgroundColor: '#3d4e5b' }}
                        >
                            {withdrawsData
                                ?.filter((item: any) => item.coin.id == myID)
                                .map((d) => (
                                    <ul className="bg-lighten-5 w-full grid grid-cols-6 text-center py-2 px-2 text-gray-300 border-b border-gray-600 text-xs lg:text-sm">
                                        <li className="w-full">
                                            <Moment date={d?.created_at} format={'LTS'} />
                                        </li>
                                        <li className="w-full">{d?.coin.symbol}</li>
                                        <li className="w-full">{d?.amount}</li>

                                        <li className="w-full">
                                            {' '}
                                            <span
                                                className={`lg:px-2 px-1 inline-flex text-xs lg:text-sm leading-5 font-semibold rounded-full text-green-800 ${
                                                    d.status == 'PENDING'
                                                        ? 'bg-yellow-100'
                                                        : d?.status == 'PAID'
                                                        ? 'bg-green-100'
                                                        : d?.status == 'DECLINE'
                                                        ? 'bg-red-100'
                                                        : ''
                                                }`}
                                            >
                                                {d?.status}
                                            </span>
                                        </li>
                                        <li className="w-full">{d?.address}</li>
                                        <li className="w-full">Withdraw</li>
                                    </ul>
                                ))}
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

const _getLayout = (page) => getLayout(page, 'Withdraw | TalanExchange', true);

export default withAuth(Withdraw, _getLayout);

import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import gate from '@gate/index';
import withAuth from 'src/helpers/withAuth';
import { getLayout } from '@components/common/Layout';
import Copy from 'assets/svg/copy.svg';
import { showError, toast } from 'src/utils';
import { LoadingSpin, Tabs } from '@components/ui';
import Moment from 'react-moment';
import useTranslation from 'next-translate/useTranslation';
import Assets from 'pages/dashboard/Assets';

const Deposit = () => {
    const { mutate: reqDeposit, isSuccess, isError, isLoading, data, error }: any = useMutation(
        gate.deposit,
    );
    const [information, setInformation] = useState<string>('Please white...');
    const { data: deposits }: any = useQuery('deposits', gate.deposits, {
        retry: 1,
        refetchOnWindowFocus: false,
    });
    const { t } = useTranslation();
    const router = useRouter();
    const { id }: any = router.query;
    const myID = id?.charAt(0)
    const symbol = id?.substring(1);

    const handleDepositClick = (id): void => {
        reqDeposit(
            { coin: id },
            {
                onSuccess: (d: any) => {
                    setInformation(d.address);
                },
                onError: (d: any) => {
                    setInformation(d?.data[0]);
                    showError(d.data, { color: 'red', gravity: 'bottom', position: 'left' });
                },
            },
        );
    };

    const copyToClipBoard = async (copyMe) => {
        try {
            await navigator.clipboard.writeText(copyMe);
            toast('Copied!');
        } catch (err) {
            toast('Failed to copy!');
        }
    };

    useEffect(() => {
        handleDepositClick(myID);
    }, []);

    


    return (
        <div className="flex flex-col w-full justify-center">
            <h1 style={{fontSize: '36px'}} className=" w-full justify-items-start flex px-2 py-5 ">
                {t('common:deposit') + ' ' + 'for' + ' ' + symbol}
            </h1>
            <div
                className={`bg-main h-80 lg:w-100 py-5 px-5 w-full rounded-2xl flex items-center justify-between` }
            >
 
                <div
                    style={{ height: '250px', marginBottom: '1rem' }}
                    className="md: w-1/2 w-full h-full mb-5"
                >
                    <Assets />
                </div>
                <div className="md: w-1/2 w-full h-full flex items-center justify-center">
                    <span
                        className={`w-11/12 ${isError && 'bg-red-500'} ${
                            isSuccess && 'bg-gray-700'
                        } ${
                            isLoading && 'bg-indigo-400'
                        } rounded-xl justify-center p-2 items-center flex lg:justify-between`}
                    >
                        <small className="w-full">
                            {isLoading && (
                                <div className="flex items-center text-light">
                                    <LoadingSpin w={25} /> Please white...
                                </div>
                            )}
                            {isError && error?.data[0]}
                            {isSuccess && `${information}`}
                        </small>

                        <div>
                            <Copy
                                className="fill-current w-5 h-5 text-yellow-600 cursor-pointer"
                                onClick={() => copyToClipBoard(information)}
                            />
                        </div>
                    </span>

                    {data?.dest_tag && (
                        <span
                            className={`w-11/12 ${isError && 'bg-red-500'} ${
                                isSuccess && 'bg-gray-700'
                            } ${
                                isLoading && 'bg-indigo-400 my-2'
                            } rounded-xl justify-center p-2 items-center flex lg:justify-between`}
                        >
                            <small className="w-full">{'data.dest_tag'}</small>

                            <div>
                                <Copy
                                    className="fill-current w-5 h-5 text-yellow-600 cursor-pointer"
                                    onClick={() => copyToClipBoard(data.dest_tag)}
                                />
                            </div>
                        </span>
                    )}

                    {data?.pubkey && (
                        <span
                            className={`w-11/12 ${isError && 'bg-red-500'} ${
                                isSuccess && 'bg-gray-700'
                            } ${
                                isLoading && 'bg-indigo-400 my-2'
                            } rounded-xl justify-center p-2 items-center flex lg:justify-between`}
                        >
                            <small className="w-full">{'data.pubkey'}</small>

                            <div>
                                <Copy
                                    className="fill-current w-5 h-5 text-yellow-600 cursor-pointer"
                                    onClick={() => copyToClipBoard(data.pubkey)}
                                />
                            </div>
                        </span>
                    )}


                </div>

                
            </div>

            <div className="lg: width: 80 w-full my-3">
                        <Tabs
                            activeTabClassName="text-white border-white"
                            defaultIndex={0}
                            tabsClassName="lg:w-100 whitespace-nowrap"
                            tabsNames={[`${t('common:deposit')} ${t('common:history')}`]}
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
                                    {deposits?.map((d) => (
                                        <ul className="bg-lighten-5 w-full grid grid-cols-6 text-center py-2 px-2 text-gray-300 border-b border-gray-600 text-xs lg:text-sm">
                                            <li className="w-full break-words">
                                                <Moment date={d?.created_at} format={'LTS'} />
                                            </li>
                                            <li className="w-full break-words">{d?.coin}</li>
                                            <li className="w-full break-words">{d?.amount}</li>

                                            <li className="w-full break-words">
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
                                            <li className="w-full break-words">{d?.address}</li>
                                            <li className="w-full break-words">Deposit</li>
                                        </ul>
                                    ))}
                                </div>
                            </div>
                        </Tabs>
                    </div>
        </div>
    );
};
const _getLayout = (page) => getLayout(page, 'Deposit | TalanExchange', true);

export default withAuth(Deposit, _getLayout);

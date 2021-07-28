import React from 'react';
import Moment from 'react-moment';
import { useQuery } from 'react-query';
import { getLayout } from '@components/common/Layout';
import { Tabs } from '@components/ui';
import gate from '@gate/index';
import { resWithdraws } from '@interfaces/index';
import withAuth from 'src/helpers/withAuth';
import useTranslation from 'next-translate/useTranslation';

const OTC = () => {
    const { t } = useTranslation();

    const { data: otcOrders }: any = useQuery('otc-orders', gate.otcOrders, {
        retry: 1,
        refetchOnWindowFocus: false,
    });
    console.log({ otcOrders });
    return (
        <div className="shadow-lg rounded-b-md overflow-hidden">
            <div
                className="w-full grid grid-cols-5 text-gray-200 px-2 py-3 text-center text-xs lg:text-sm"
                style={{ backgroundColor: '#465d6f' }}
            >
                <span className="w-full">{t('common:date')}</span>
                <span className="w-full">{t('common:coins')}</span>
                <span className="w-full">{t('common:amount')}</span>
                <span className="w-full">{t('common:rate')}</span>
                <span className="w-full">{t('common:converted')}</span>
            </div>
            <div
                className="overflow-y-auto overflow-x-none max-h-96 custom_scrollbar
"
                style={{ backgroundColor: '#3d4e5b' }}
            >
                {otcOrders &&
                    otcOrders?.map((d) => (
                        <ul className="bg-lighten-5 w-full grid grid-cols-5 text-center py-2 px-2 text-gray-300 border-b border-gray-600 text-xs lg:text-sm">
                            <li className="w-full">
                                <Moment date={d?.created_at} format={'LTS'} />
                            </li>
                            <li className="w-full">
                                {d?.base_coin?.name}-{d?.quote_coin?.name}
                            </li>
                            <li className="w-full">{d?.amount}</li>

                            <li className="w-full">
                                {' '}
                                <span>{d?.rate}</span>
                            </li>
                            <li className="w-full">{d?.receive_amount}</li>
                        </ul>
                    ))}
            </div>
        </div>
    );
};
const History = () => {
    const { data } = useQuery('withdraws', gate.withdraws, { retry: 1 });

    const { data: deposits }: any = useQuery('deposits', gate.deposits, {
        retry: 1,
        refetchOnWindowFocus: false,
    });

    const withdrawsData: any = data;
    const { t } = useTranslation();

    console.log(deposits);
    return (
        <div>
            <Tabs
                activeTabClassName="text-white border-white"
                defaultIndex={0}
                tabsClassName="lg:w-80 whitespace-nowrap"
                tabsNames={[`${t('common:deposit')} & ${t('common:withdraw')}`, 'OTC']}
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
                        {withdrawsData?.map((d) => (
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
                <OTC />
            </Tabs>
        </div>
    );
};

const _getLayout = (page) => getLayout(page, 'Trade | TalanExchange', true);

export default withAuth(History, _getLayout);

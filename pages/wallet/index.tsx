import React, { Fragment } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { WalletCard } from '@components/ui';

import { CoinData } from '@interfaces/index';
import { useGetCoins, useGetUserWallet } from 'hooks/hooks';
import { getLayout } from '@components/common/Layout';
import withAuth from 'src/helpers/withAuth';

const CardWrapper = ({ title, children }) => {
    return (
        <div className="flex flex-col mb-10 px-5">
            <span className="text-gray-400 font-thin text-base mb-3">{title}</span>
            <div className="flex flex-wrap sm:justify-start justify-center">{children}</div>
        </div>
    );
};

const Wallet = () => {
    const { t } = useTranslation();
    const {data: allCoins} = useGetCoins();
    const { data }: any = useGetUserWallet();
    const fiat: CoinData[] = data?.filter((d) => d.coin.coint_type == 'FIAT');
    const coins: CoinData[] = data?.filter((d) => d.coin.coint_type == 'COIN');
    const stable_coin: CoinData[] = data?.filter((d) => d.coin.coint_type == 'STABLE_COIN');
    const token: CoinData[] = data?.filter((d) => d.coin.coint_type == 'TOKEN');

    return (
        <div>
            {!!fiat?.length && (
                <CardWrapper title={t('common:fiat')}>
                    {fiat?.map((c) => (
                        <Fragment key={c?.coin?.symbol}>
                            <WalletCard data={c} coins={allCoins} />
                            <span className="mx-2" />
                        </Fragment>
                    ))}
                </CardWrapper>
            )}
            {!!coins?.length && (
                <CardWrapper title={t('common:coins')}>
                    {coins?.map((c) => (
                        <Fragment key={c?.coin?.symbol}>
                            <WalletCard data={c} coins={allCoins} />
                            <span className="mx-2" />
                        </Fragment>
                    ))}
                </CardWrapper>
            )}
            {!!stable_coin?.length && (
                <CardWrapper title={t('common:stable-coins')}>
                    {stable_coin?.map((c) => (
                        <Fragment key={c?.coin?.symbol}>
                            <WalletCard data={c} coins={allCoins} />
                            <span className="mx-2" />
                        </Fragment>
                    ))}
                </CardWrapper>
            )}
            {!!token?.length && (
                <CardWrapper title={t('common:token')}>
                    {token?.map((c) => (
                        <Fragment key={c?.coin?.symbol}>
                            <WalletCard data={c} coins={allCoins} />
                            <span className="mx-2" />
                        </Fragment>
                    ))}
                </CardWrapper>
            )}
        </div>
    );
};

const _getLayout = (page) => getLayout(page, 'Wallet | TalanExchange', true);

export default withAuth(Wallet, _getLayout);

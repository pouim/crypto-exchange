import React, { useState } from 'react';
import { DropDown } from '@components/ui';
import { CoinData } from '@interfaces/index';
import styles from './style.module.css';

import Link from 'next/link';
import useTranslation from 'next-translate/useTranslation';
import { useSelector } from 'react-redux';

// interface Props {
//     data: CoinData;
// }



const index = ({ data, coins }: any) => {
    const { t } = useTranslation();

    const [show, setShow] = useState<boolean>(false);

    const { coin, total } = data;
    const dir = useSelector((state: any) => state?.appearance?.dir);
    
    const currentCoin = coins?.filter(item => item?.id === coin?.id)
    console.log(currentCoin && currentCoin[0])
    const subStrIcon = coin?.icon?.substring(21);
    const coinIcon = `http://185.110.189.66${subStrIcon}`; 
    return (
        <>
            <div className={`w-full h-auto my-4 p-2 rounded-lg relative sm:w-52 ${styles.card_bg}`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <img
                            src={coinIcon ?? '/images/eur.png'}
                            alt="eur"
                            className="w-7 h-7 rounded-full"
                        />
                        <div className="mx-2">
                            <h4>{coin?.symbol}</h4>
                            <button className="text-xs text-gray-400">
                                {t('common:ID')}: {coin?.id}
                            </button>
                            <button className="text-xs text-gray-400 mx-2">
                                {t('common:fee')}: {currentCoin && +currentCoin[0]?.fee}
                            </button>
                        </div>
                    </div>
                    <button
                        className="outline-none focus:outline-none text-main-green"
                        onClick={() => setShow(!show)}
                    >
                        ...
                        <DropDown
                            visible={show}
                            onClose={() => setShow(!show)}
                            className={`text-gray-300 rounded-lg ${
                                dir == 'ltr' ? 'right-1' : 'left-1'
                            }  min-w-max place-items-start`}
                            style={{ textAlign: 'start' }}
                        >
                            <Link href="/deposit/[id]" as={`/deposit/${coin.id}${coin.symbol}`}>
                                <div className="bg-c-secondary-900 hover:bg-c-secondary-700 px-5 py-2">
                                    {t('common:deposit')}
                                </div>
                            </Link>
                            <Link href="/withdraw/[id]" as={`/withdraw/${coin.id}${coin.symbol}`}>
                                <div className="bg-c-secondary-900 hover:bg-c-secondary-700 px-5 py-2">
                                    {t('common:withdraw')}
                                </div>
                            </Link>
                            {/* <div className="bg-c-secondary-900 hover:opacity-80 px-5 py-2">
                                Exchange
                            </div> */}
                        </DropDown>
                    </button>
                </div>
                <div>
                    <dl className="my-1 py-2">
                        <dt className="text-xs text-gray-400">{t('common:total')}</dt>
                        <dd className="text-2xl">{total}</dd>
                    </dl>
                    <dl className="py-2">
                        <dt className="text-xs text-gray-400">{t('common:available')}</dt>
                        <dd className="text-sm">{data.available}</dd>
                    </dl>
                </div>
            </div>
        </>
    );
};

export default index;

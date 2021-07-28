import { CheckBox } from '@components/ui';
import styles from './styles.module.css';
import { useGetUserWallet } from 'hooks/hooks';
import React, { FC, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useRouter } from 'next/router';

import Menu from 'assets/svg/menu.svg';

interface Props {
    isTradePage?: boolean;
    noCaption?: boolean;
}

const Assets: FC<Props> = ({ isTradePage = false, noCaption }) => {
    const { data }: any = useGetUserWallet();
    const [showZeroOnly, SetShowZeroOnly] = useState<boolean>(false);
    const { t } = useTranslation();
    const { asPath } = useRouter();

    const balanceNotZeroData = data?.filter((d: any) => d.total !== 0);
    return (
        <div className={`${styles.parent} scrollbar-none`}>
            {asPath.startsWith('/withdraw') ? (
                <h1 className="py-3 w-full justify-items-start flex px-4">{t('common:assets')}</h1>
            ) : !noCaption && (
                <div className="flex flex-row px-2 py-3 mb-2  justify-items-between items-center cursor-pointer dragMe">
                    <Menu className="w-3 h-3 fill-current text-green-white mr-2" />
                    <h1>{t('common:assets')}</h1>
                </div>
            )}

            <div className="flex items-center px-4 mb-2">
                <CheckBox onChange={() => SetShowZeroOnly(!showZeroOnly)} />
                <span className="text-xs">{t('common:hide-zero-balances')}</span>
            </div>
            <div className="h-full min-w-max">
                <div
                    className={`w-full flex justify-around text-gray-400 ${
                        isTradePage == false && 'lg:px-4'
                    }`}
                >
                    <small className="w-full text-center">{t('common:currency')}</small>
                    <small className="w-full text-center">{t('common:available')}</small>
                    <small className="w-full text-center">{t('common:total')}</small>
                    <small className="w-full text-center">{t('common:in-order')}</small>
                </div>
                <div
                    className={`${styles.cdk_virtual_scroll_viewport} ${styles.info_table} hide-scrollbar`}
                    style={{ minWidth: 400 }}
                >
                    <ul className={`${styles.cdk_virtual_scroll_content_wrapper} scrollbar-none`}>
                        {showZeroOnly &&
                            balanceNotZeroData?.map((c: any) => (
                                <li
                                    key={c.coin.created_at}
                                    className={`hover:bg-main hover:opacity-70 py-1 transition-all lg:px-4 ${
                                        isTradePage == false && 'lg:px-4'
                                    }`}
                                >
                                    <div className="flex justify-around items-center">
                                        <small className="w-full text-center flex">
                                            <img
                                                src={
                                                    `http://185.110.189.66${c?.coin?.icon?.substring(
                                                        21,
                                                    )}` ?? '/images/eur.png'
                                                }
                                                className="h-7 w-7 mx-1 rounded-full self-center"
                                            />
                                            <div>
                                                <span className="block">{c?.coin?.name}</span>
                                                <span className="block">
                                                    {t('common:ID')}: {c?.coin?.id}
                                                </span>
                                            </div>
                                        </small>
                                        <small className="w-full text-center">{c.available}</small>
                                        <small className="w-full text-center">{c?.total}</small>
                                        <small className="w-full text-center">{c?.in_order}</small>
                                    </div>
                                </li>
                            ))}
                        {showZeroOnly == false &&
                            data?.map((c: any) => (
                                <li
                                    key={c.coin.created_at}
                                    className={`hover:bg-main hover:opacity-70 py-1 transition-all px-0  ${
                                        isTradePage == false && 'lg:px-4'
                                    }`}
                                >
                                    <div className="flex justify-around items-center">
                                        <small className="w-full text-center flex">
                                            <img
                                                src={
                                                    `http://185.110.189.66${c?.coin?.icon?.substring(
                                                        21,
                                                    )}` ?? '/images/eur.png'
                                                }
                                                className="h-7 w-7 mx-1 rounded-full self-center"
                                            />
                                            <div>
                                                <span className="block">{c?.coin?.name}</span>
                                                <span className="block">
                                                    {t('common:ID')}: {c?.coin?.id}
                                                </span>
                                            </div>
                                        </small>
                                        <small className="w-full text-center">{c.available}</small>
                                        <small className="w-full text-center">{c?.total}</small>
                                        <small className="w-full text-center">{c?.in_order}</small>
                                    </div>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Assets;

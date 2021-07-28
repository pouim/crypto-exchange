import React, { FC, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import useTranslation from 'next-translate/useTranslation';
import { BackDrop } from '@components/ui';
import { isSideBarOpen } from 'store/reducers/appearance';
import LinkItem from './LinkItem';

import styles from './styles.module.css';

import Logo from 'assets/svg/logo.svg';
import DashSvg from 'assets/svg/homeIcon.svg';
import Wallet from 'assets/svg/wallet.svg';
import Exchange from 'assets/svg/exchange.svg';
import Profile from 'assets/svg/profile.svg';
import History from 'assets/svg/history.svg';
import HelpDesk from 'assets/svg/helpdesk.svg';
import { useWindowDimensions } from 'hooks/hooks';

const SideBar = () => {
    const { asPath, push } = useRouter();
    const sideBar = useSelector((state: any) => state?.appearance?.sideBar);
    const dir = useSelector((state: any) => state?.appearance?.dir);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const svg_class = 'w-5 h-5 fill-current text-green-white';
    const { height, width }: any = useWindowDimensions();

    const setLayout = () => {
        if (width < 640) {
            dispatch(isSideBarOpen('CLOSE'));
        } else {
            dispatch(isSideBarOpen('MEDIUM'));
        }
    };

    const handleSidebarMouseEnter = () => {
        if(asPath === '/trade' && sideBar === 'MINI') {
            dispatch(isSideBarOpen('MEDIUM'));
        }
    }

    const handleSidebarMouseLeave = () => {
        if(asPath === '/trade' && sideBar === 'MEDIUM') {
            dispatch(isSideBarOpen('MINI'));
        }
    }
    return (
        <>
            {(sideBar == 'MEDIUM' || sideBar == 'CHILD') && (
                <BackDrop
                    click={() => {
                        dispatch(isSideBarOpen('CLOSE'));
                    }}
                />
            )}

            <div
                onMouseEnter={handleSidebarMouseEnter}
                onMouseLeave={handleSidebarMouseLeave}
                className={`${styles.sidenav}  ${
                    sideBar == 'MEDIUM'
                        ? styles.open
                        : `flex ${
                              sideBar === 'CHILD'
                                  ? styles.child
                                  : dir == 'rtl' && width <= 640
                                  ? styles.close_rtl
                                  : styles.close_ltr
                          }`
                } ${
                    sideBar == 'MINI' ? 'w-16' : 'w-9/12 sm:w-4/12 md:w-3/12 lg:w-2/12'
                } transition-all bg-c-secondary absolute ${dir == 'ltr' ? 'left-0' : 'right-0'}`}
            >
                <div
                    className={`overflow-x-hidden ${
                        sideBar == 'CHILD' ? 'w-24' : 'w-full'
                    } transition-all duration-75 overscroll-y-auto h-screen top-0  sticky hide-scrollbar `}
                >
                    {sideBar !== 'CHILD' && sideBar !== 'MINI' && (
                        <div className="w-full px-2 justify-start h-24 items-center flex">
                            <Logo className="w-10 h-10 fill-current mx-2 text-muted cursor-pointer" />
                            <div className="w-full flex flex-col">
                                <small>
                                    <b>Excops</b>
                                </small>
                                <small className="text-main-green text-xs">EXCHANGE CENTER</small>
                            </div>
                        </div>
                    )}

                    <ul className="flex flex-col">
                        <LinkItem
                            normal={true}
                            name={t('common:dashboard')}
                            link="/"
                            onClick={() => {
                                setLayout();
                                push('/');
                            }}
                        >
                            {<DashSvg className={svg_class} />}
                        </LinkItem>
                        <LinkItem
                            normal={true}
                            link="/wallet"
                            name={t('common:wallet')}
                            onClick={() => {
                                setLayout();
                                push('/wallet');
                            }}
                        >
                            {<Wallet className={svg_class} />}
                        </LinkItem>

                        <LinkItem
                            normal={true}
                            link="/trade"
                            name={t('common:trade')}
                            onClick={() => {
                                dispatch(isSideBarOpen('CHILD'));
                            }}
                        >
                            {<Exchange className={svg_class} />}
                        </LinkItem>

                        <LinkItem
                            normal={true}
                            name={t('common:profile')}
                            link="/profile/setting"
                            onClick={() => {
                                push('/profile/setting');
                                setLayout();
                            }}
                        >
                            {<Profile className={svg_class} />}
                        </LinkItem>
                        <LinkItem
                            normal={true}
                            name={t('common:history')}
                            link="/history"
                            onClick={() => {
                                setLayout();
                                push('/history');
                            }}
                        >
                            {<History className={svg_class} />}
                        </LinkItem>
                        <LinkItem
                            normal={true}
                            name={t('common:help-desk')}
                            link="/help-desk"
                            onClick={() => {
                                setLayout();
                                push('/help-desk');
                            }}
                        >
                            {<HelpDesk className={svg_class} />}
                        </LinkItem>
                    </ul>
                    {sideBar == 'MEDIUM' && (
                        <>
                            <div className="my-12 px-5 text-sm">{t('common:need-help')}</div>
                            <ul className="flex flex-col mb-14">
                                <small className="my-1 flex px-5 text-gray-500 hover:text-white transition-all cursor-pointer items-center">
                                    {t('common:Customer-Agreement')}
                                </small>
                                <small className="my-1 flex px-5 text-gray-500 hover:text-white transition-all cursor-pointer items-center">
                                    {t('common:Order-Execution-Policy')}
                                </small>
                                <small className="my-1 flex px-5 text-gray-500 hover:text-white transition-all cursor-pointer items-center">
                                    {t('common:Summary-of-Conflicts')}
                                </small>
                                <small className="my-1 flex px-5 text-gray-500 hover:text-white transition-all cursor-pointer items-center">
                                    {t('common:API-Documentation')}
                                </small>
                            </ul>
                        </>
                    )}
                </div>
                {sideBar == 'CHILD' && (
                    <div className={`transition-opacity bg-c-secondary-900 w-full `}>
                        {/* <div
                            className="bg-c-secondary-900 hover:bg-c-secondary-700 cursor-pointer px-5 py-2"
                            onClick={() => {
                                setLayout();
                                push('/trade/OTC');
                            }}
                        >
                            {t('common:otc')}
                        </div> */}
                        <div
                            onClick={() => {
                                dispatch(isSideBarOpen('MINI'));
                                push('/trade');
                            }}
                            className="bg-c-secondary-900 hover:bg-c-secondary-700 cursor-pointer px-5 py-2"
                        >
                            {t('common:spot')}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SideBar;

import React, { FC, useState } from 'react';
import { DropDown } from '@components/ui';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useQuery } from 'react-query';
import Notification from 'assets/svg/notification.svg';
import gate from '@gate/index';
import Menu from 'assets/svg/menu.svg';
import { useDispatch } from 'react-redux';
import { isSideBarNotifOpen, isSideBarOpen } from 'store/reducers/appearance';
import { useWindowDimensions } from 'hooks/hooks';
import Logo from 'assets/svg/logo.svg';
import styles from './styles.module.css';
import LinkItem from './HorizontalLinkItem';
import Profile from 'assets/svg/profile.svg';
import Exchange from 'assets/svg/exchange.svg';
import DashSvg from 'assets/svg/homeIcon.svg';
import Wallet from 'assets/svg/wallet.svg';
import History from 'assets/svg/history.svg';
import HelpDesk from 'assets/svg/helpdesk.svg';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    title?: string;
}

const Header: FC<Props> = ({ title = 'LOGO' }) => {
    const { asPath, push } = useRouter();
    const svg_class = 'w-5 h-5 fill-current text-green-white';
    const router = useRouter();
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { height, width }: any = useWindowDimensions();

    return (
        <div
            style={{
                borderBottom: '.01rem solid rgba(255,255,255, 0.2)',
                marginBottom: '1rem',
                boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
            }}
            className={`px-5 w-full bg-transparent flex justify-between items-center relative max-h-15 ${
                asPath == '/help-desk' && styles.display_on_helpDesk
            }`}
        >
            {asPath !== '/auth' && (
                <span className="w-1/3 justify-start flex md:hidden">
                    <Menu
                        width={25}
                        height={25}
                        className="w-5 h-5 fill-current text-white cursor-pointer md:cursor-default"
                        onClick={() => dispatch(isSideBarOpen('MEDIUM'))}
                    />
                </span>
            )}

            <span style={{maxHeight: '100px'}} className="cursor-default w-1/3 hidden md:flex lg:justify-start justify-center items-center">
                {/* <div className="w-full px-2 justify-start h-24 items-center flex">
                    <Logo className="w-10 h-10 fill-current mx-2 text-muted cursor-pointer" />
                    <div className="w-full flex flex-col">
                        <small>
                            <b>Excops</b>
                        </small>
                        <small className="text-main-green text-xs">EXCHANGE CENTER</small>
                    </div>
                </div> */}
                {asPath !== '/auth' && (
                    <ul className="flex h-full">
                        <LinkItem
                            normal={true}
                            name={t('common:dashboard')}
                            link="/"
                            onClick={() => {
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
                                push('/trade');
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
                            }}
                        >
                            {<Profile className={svg_class} />}
                        </LinkItem>
                        <LinkItem
                            normal={true}
                            name={t('common:history')}
                            link="/history"
                            onClick={() => {
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
                                push('/help-desk');
                            }}
                        >
                            {<HelpDesk className={svg_class} />}
                        </LinkItem>
                    </ul>
                )}
            </span>

            <span className="flex w-1/3 justify-end whitespace-nowrap">
                {asPath !== '/auth' && (
                    <span className="mx-2 cursor-pointer">
                        <Notification
                            className="w-5 h-5 fill-current text-green-white mx-5"
                            onClick={() => dispatch(isSideBarNotifOpen('OPEN'))}
                        />
                    </span>
                )}
                <span className="cursor-pointer" onClick={() => setShow(!show)}>
                    <DropDown
                        visible={show}
                        onClose={() => setShow(!show)}
                        className="whitespace-nowrap text-gray-300 rounded-lg absolute min-w-max place-items-start -left-10 top-6 z-50"
                        style={{ textAlign: 'start', transition: 'transform .4s ease-in-out' }}
                    >
                        {router.locales?.map((locale) => (
                            <Link href={router.asPath} locale={locale} key={locale}>
                                <div
                                    className="bg-c-secondary-900 hover:bg-main transition-all px-3 py-2 flex"
                                    style={{ transition: 'transform .4s ease-in-out' }}
                                >
                                    {locale == 'IR' && (
                                        <img
                                            className="w-6 h-6 mx-2"
                                            src="/images/iranian-flag.png"
                                        />
                                    )}
                                    {locale == 'en-US' && (
                                        <img className="w-6 h-6 mx-2" src="/images/lang-en.png" />
                                    )}
                                    {locale}
                                </div>
                            </Link>
                        ))}
                    </DropDown>
                    {router.locale}
                </span>
            </span>
        </div>
    );
};

export default Header;

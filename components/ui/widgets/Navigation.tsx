import { useMutation } from 'react-query';
import gate from 'gate/index';
import styles from './styles.module.css';
import { useGetUserWallet } from 'hooks/hooks';
import { generateCoinSymbol } from 'src/utils';
import { FC, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { currentCoinPath } from '@store/selectors/coin';
import { ComboBox } from '..';
import useTranslation from 'next-translate/useTranslation';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import Cookies from 'js-cookie';

import Logo from 'assets/svg/logo.svg';
import DashSvg from 'assets/svg/homeIcon.svg';
import Wallet from 'assets/svg/wallet.svg';
import Exchange from 'assets/svg/exchange.svg';
import ExchangeBeta from 'assets/svg/exchange-beta.svg';
import Profile from 'assets/svg/profile.svg';
import History from 'assets/svg/history.svg';
import HelpDesk from 'assets/svg/helpdesk.svg';
import Menu from 'assets/svg/menu.svg';
import { useRouter } from 'next/router';

const Navigation: FC<any> = ({}) => {
    const { asPath, push } = useRouter();
    const { t } = useTranslation();

    return (
        <div
            className={`${styles.parent} ${styles.odd} w-full px-3 flex flex-col justify-start h-content`}
        >
            <div className="flex flex-row px-2 py-3 mb-2  justify-items-between items-center cursor-pointer dragMe">
                <Menu className="w-3 h-3 fill-current text-green-white mr-2" />
                <h1> {t('common:navigation')}</h1>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        margin: '0 20px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        justifyItems: 'center',
                        alignContent: 'center',
                        padding: 10,
                        borderRadius: 10,
                        color: 'white',
                        cursor: 'pointer',
                    }}
                    className="walk-item"
                    onClick={() => {
                        push('/wallet');
                    }}
                >
                    <Wallet className="w-8 h-8 fill-current text-green-white" />
                    <div style={{ margin: 5 }} />
                    <div>
                        <div style={{ fontSize: 12 }}>{t('common:wallet')}</div>
                    </div>
                </div>
                <div style={{ margin: 5 }} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '0 20px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            justifyItems: 'center',
                            alignContent: 'center',
                            padding: 10,
                            borderRadius: 10,
                            color: 'white',
                            cursor: 'pointer',
                        }}
                        className="walk-item"
                        onClick={() => {
                            push('/trade');
                        }}
                    >
                        <Exchange className="w-8 h-8 fill-current text-green-white" />
                        <div style={{ margin: 5 }} />
                        <div>
                            <div style={{ fontSize: 12 }}>{t('common:spot')}</div>
                        </div>
                    </div>
                </div>
                <div style={{ margin: 5 }} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '0 20px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            justifyItems: 'center',
                            alignContent: 'center',
                            padding: 10,
                            borderRadius: 10,
                            color: 'white',
                            cursor: 'pointer',
                        }}
                        className="walk-item"
                        onClick={() => {
                            push('/trade/OTC');
                        }}
                    >
                        <ExchangeBeta className="w-8 h-8 fill-current text-green-white" />
                        <div style={{ margin: 5 }} />
                        <div>
                            <div style={{ fontSize: 12 }}>{t('common:otc')}</div>
                        </div>
                    </div>
                </div>
                <div style={{ margin: 5 }} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '0 20px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            justifyItems: 'center',
                            alignContent: 'center',
                            padding: 10,
                            borderRadius: 10,
                            color: 'white',
                            cursor: 'pointer',
                        }}
                        className="walk-item"
                        onClick={() => {
                            push('/history');
                        }}
                    >
                        <History className="w-8 h-8 fill-current text-green-white" />
                        <div style={{ margin: 5 }} />
                        <div>
                            <div style={{ fontSize: 12 }}>{t('common:history')}</div>
                        </div>
                    </div>
                </div>
                <div style={{ margin: 5 }} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            margin: '0 20px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            justifyItems: 'center',
                            alignContent: 'center',
                            padding: 10,
                            borderRadius: 10,
                            color: 'white',
                            cursor: 'pointer',
                        }}
                        className="walk-item"
                        onClick={() => {
                            push('/help-desk');
                        }}
                    >
                        <HelpDesk className="w-8 h-8 fill-current text-green-white" />
                        <div style={{ margin: 5 }} />
                        <div>
                            <div style={{ fontSize: 12 }}>{t('common:help-desk')}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navigation;

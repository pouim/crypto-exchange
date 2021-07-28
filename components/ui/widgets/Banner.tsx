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
import { useRouter } from 'next/router';

const Navigation: FC<any> = ({}) => {
    const { asPath, push } = useRouter();
    const { t } = useTranslation();

    return (
        <div
            className={`${styles.parent} ${styles.odd} w-full px-3 flex flex-col justify-start h-content cursor-pointer dragMe`}
            style={{
                backgroundImage: `url(${"./images/banner.png"})`,
                backgroundSize: 'cover',
            }}
        ></div>
    );
};

export default Navigation;

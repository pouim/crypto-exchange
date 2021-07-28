import React, { FC, useState } from 'react';
import { Layout } from '@components/common';
import style from './style.module.css';
import SignIn from '@components/ui/auth/signIn';
import SignUp from '@components/ui/auth/signUp';
import ForgetPass from '@components/ui/auth/forgetPass';
import useTranslation from 'next-translate/useTranslation';
import { getLayout } from '@components/common/Layout';
import Logo from 'assets/svg/logo.svg';
import Otp from '@components/ui/auth/otp';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthPage } from '@store/reducers/appearance';
const index = () => {
    const { t } = useTranslation();

    // const [page, setPage] = useState<string>('sign-in');
    const {authPage} = useSelector((state: any) => state.appearance);
    const dispatch = useDispatch();

    return (
        <div className="flex min-h-screen items-center lg:px-28 text-light">
            <div className="flex justify-center items-center w-full mx-2">
                <div className="flex flex-col items-center w-full">
                    <div className="w-full flex justify-center h-24 items-center text-xl">
                        <div>
                            <Logo className="w-10 h-10 fill-current text-muted mx-3 cursor-pointer" />
                        </div>
                        <div className="flex flex-col">
                            <span className="p-0">
                                <b>Excops</b>
                            </span>
                            <small className="text-main-green text-xs">EXCHANGE CENTER</small>
                        </div>
                    </div>
                    <div className="w-full mx-5 lg:w-3/6 md:3/6 sm:w-4/6 xl:max-w-md">
                        <div className={style.card_h_text}>
                            {authPage == 'sign-in' ? t('common:is-member') : t('common:member')}{' '}
                            <b
                                className="cursor-pointer"
                                onClick={() =>
                                    dispatch(setAuthPage(authPage == 'sign-in' ? 'sign-up' : 'sign-in'))
                                }
                            >
                                {authPage == 'sign-in'
                                    ? t('common:sign-up-now')
                                    : t('common:sign-in-now')}
                            </b>
                        </div>
                        {authPage == 'sign-in' ? (
                            <SignIn setPage={() => dispatch(setAuthPage('forget'))} />
                        ) : authPage == 'sign-up' ? (
                            <SignUp backToSignInPage={() => dispatch(setAuthPage('sign-in'))} />
                        ) : authPage == 'otp' ? (
                            <Otp backToSignInPage={() => dispatch(setAuthPage('sign-in'))} />
                        ) : (
                            <ForgetPass backToSignInPage={() => dispatch(setAuthPage('sign-in'))} />
                        )}
                    </div>

                    <div className="my-5 flex flex-col items-center">
                        <small className="text-gray-500 text-10p">
                            {t('common:contact-us')}{' '}
                            <span className="text-main-green">{t('common:exchange-email')}</span>
                        </small>
                        <small className="text-gray-500 mb-5 text-10p">if you have problems</small>
                        <small className="text-10p">
                            <b>
                                B2BX Digital Exchange OÜ, address: Narva mnt 63/4, 10152 Tallinn,
                                Estonia. License No FVT000176, dated 30.09.2020.
                            </b>
                        </small>
                        <small className="text-10p text-center">
                            <b>Risk disclaimer:</b> Trading at the B2BX exchange may lead to the
                            loss of invested funds. If you continue using our website, you confirm
                            that you have read all information provided within the relevant
                            documents and understand all risks associated with trading at the B2BX
                            exchange. We draw your attention to the fact that we do not perform
                            trading for and on behalf of clients, at the B2BX exchange, we do not
                            promise any profit and do not give any investment advice. We only
                            provide the access to trade, however, the decision to trade or not is
                            your own, deliberate decision. We do not offer services of B2BX exchange
                            to citizens of jurisdictions where the right to trade is limited or
                            prohibited by the rules of current legislation. By registering at the
                            B2BX exchange, you confirm that you have reached the required age and
                            are fully capable, and also you have all necessary rights to use the
                            services of the B2BX exchange, according to the jurisdiction or the
                            country of which you are a citizen or resident. Also, you have read all
                            documents posted on the website, including the Customer Agreement, the
                            Risk Warning, the Privacy Policy and the Cookie Policy, as well as all
                            other documents provided by the B2BX exchange, and completely agree with
                            them. Documents posted at the website are available only in English. You
                            acknowledge possessing a sufficient knowledge of the English language,
                            at level necessary to understand the information included with the
                            documents, and you fully understand the legal consequences of the
                            documents. In case you do not understand or understand the English
                            language poorly, you acknowledge that you shall use the services of a
                            professional interpreter, prior to agreeing to the relevant terms
                            included within the documents. If you do not agree with any of the above
                            statements and/or documents, please leave this website immediately.
                            Continuation of your usage of our website confirms your agreement with
                            the above statements and documents. Wallets in FIAT currencies (as USD,
                            EUR or other) can be used only for short-term storage of funds for
                            cryptocurrencies purchase.
                        </small>
                        <small className="text-10p text-center mt-5">
                            <b>
                                B2BX does not offer Services to residents of USA, Afghanistan,
                                American Samoa, the Bahamas, Botswana, Democratic People's Republic
                                of Korea, Ethiopia, Ghana, Guam, Iran, Iraq, Libya, Nigeria,
                                Pakistan, Panama, Puerto Rico, Samoa, Saudi Arabia, Sri Lanka,
                                Syria, Trinidad and Tobago, Tunisia, US Virgin Islands, Yemen B2BX
                                exchange doesn't provide leverage trading or CFD trading with
                                cryptocurrency.
                            </b>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

index.getLayout = (page) => getLayout(page, 'Auth | TalanExchange', false);

export default index;

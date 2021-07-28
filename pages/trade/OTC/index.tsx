import { getLayout } from '@components/common/Layout';
import { Button, ComboBox } from '@components/ui';
import React, { useEffect, useState } from 'react';
import withAuth from 'src/helpers/withAuth';
import SuccessSvg from 'assets/svg/success.svg';
import useTranslation from 'next-translate/useTranslation';
import { useSelector } from 'react-redux';
import { currentCoinPath } from '@store/selectors/coin';
import TradingView from 'components/ui/widgets/TradingViewOtc';
import { useForm } from 'react-hook-form';
import { useGetUserWallet } from 'hooks/hooks';
import { generateCoinSymbol } from 'src/utils';
import { useMutation, useQuery } from 'react-query';
import gate from '@gate/index';
import Timer from '@components/ui/Timer';
import { toast } from 'react-toastify';
import LoadSpin from '@components/ui/Loading/LoadingSpin';
import Cookies from 'js-cookie';
import styles from '../../dashboard/styles.module.css';
import { socket } from 'src/helpers/socket';
import trade from '..';

const SuccessChange = ({ back, t, data, reqData }) => {
    return (
        <div className="flex flex-col items-center justify-center transition-all delay-700 lg:w-10/12 w-full h-full">
            <SuccessSvg className="fill-current text-muted cursor-pointer w-10 h-10" />
            <h4 className="my-3">{t('common:successful')}</h4>
            {/* <span className="my-1 text-sm">{t('common:you-will-spend')}</span> */}
            {/* <span className="my-3 text-lg">100 BNB</span> */}
            <div className="w-full flex justify-between">
                <div className="w-full flex flex-col justify-around">
                    <div className="my-1">
                        <div className="flex w-full justify-between">
                            <small>{t('common:converted')}</small>
                            <small>
                                <b>
                                    {data?.receive_amount} {reqData?.base?.coin?.symbol}
                                </b>
                            </small>
                        </div>
                        <div className="flex w-full justify-between">
                            <small>{t('common:price')}</small>
                            <small>
                                <b>
                                    1 {reqData?.base?.coin?.symbol} = {data?.rate}{' '}
                                    {reqData?.to?.coin?.symbol}
                                </b>
                            </small>
                        </div>
                    </div>
                    <div className="flex justify-center w-full my-5">
                        {/* <div> */}
                        <Button
                            className="btn focus-within:outline-none bg-muted text-white hover:opacity-90"
                            onClick={back}
                        >
                            {t('common:back')}
                        </Button>
                        {/* </div> */}
                        {/* <div className="w-5/12">
                            <Button classBtn="whitespace-nowrap hover:opacity-90">
                                {t('common:view-status')}
                            </Button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Input = ({ side, placeholder, title, t, register, name, coins, setCoinsSelected, error }) => {
    const currentCoin: any = useSelector<any>(currentCoinPath);

    const dir = useSelector((state: any) => state?.appearance?.dir);
    const inputClass =
        dir == 'ltr'
            ? 'absolute inset-y-0 right-0 flex items-center'
            : 'absolute inset-y-0 left-0 flex items-center';
    return (
        <>
            <div className="my-4 w-full">
                <label htmlFor="price" className="block text-sm font-medium text-gray-400">
                    {title}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                        ref={register}
                        type="number"
                        step="0.01"
                        name={name}
                        className="focus:bg-c-secondary-800 group-hover:bg-lighten-5 hover:bg-muted-500 focus-within:bg-c-secondary-800 block w-full pl-7 pr-2 sm:text-sm rounded-md py-2 focus:outline-none bg-c-secondary-800"
                        placeholder={placeholder}
                    />

                    <div className={inputClass}>
                        <ComboBox
                            wrapperClassName="w-28"
                            color="bg-c-secondary-800"
                            className=""
                            title={''}
                            defaultValue={currentCoin}
                            data={coins}
                            onSelectedItem={(item) => setCoinsSelected(item)}
                            isLoading={false}
                            renderItem={(item) => {
                                return (
                                    <div className="w-full h-full p-2 flex justify-start w- hover:bg-c-secondary-900 transition-all duration-300">
                                        {item}
                                    </div>
                                );
                            }}
                            name="provinceId"
                        />
                    </div>
                </div>
            </div>
            <div className="w-full my-3 flex justify-start">
                <small className={`text-xs text-red-400`}>{error}</small>
            </div>
        </>
    );
};

const OTC = () => {
    const [page, setPage] = useState(1);
    const [lastBarOtc, setLastBarOtc] = useState(null);
    const [bidPrice, setBidPrice] = useState<any>(null);
    const [askPrice, setAskPrice] = useState<any>(null);
    const [sid, setSid] = useState(null);
    const { mutate: getQuote, isLoading: getQuoteLoading } = useMutation(gate.getQuote);
    const { mutate: finishQuote, data } = useMutation(gate.finishQuote);
    const { t } = useTranslation();
    const wPage = page !== 3 ? 'lg:w-1/2 w-full h-96' : 'h-96 lg:w-1/2 w-full';
    const { register, handleSubmit, reset, errors, getValues } = useForm({ mode: 'all' });
    const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
    const currentCoin: any = useSelector<any>(currentCoinPath);
    const [CoinsSelected, setCoinsSelected] = useState(currentCoin);
    const { data: coins, isLoading }: any = useGetUserWallet();
    const coins_data = generateCoinSymbol(coins);
    const [isSecondFinish, setIsSecondFinish] = useState(false);
    const [qouteData, setQouteData] = useState<any>(null);
    const [key, setKey] = useState(1);
    const [otcAccessToken, setotcAccessToken] = useState(null);
    const [reqData, setReqData] = useState<any>({ amount: 0, base: null, to: null });
    console.log({ errors });
    const { data: otcToken }: any = useQuery('otc-token', gate.otcToken, {
        retry: 1,
        refetchOnWindowFocus: false,
        onSuccess: (data: any) => {
            setotcAccessToken(data);
            Cookies.set('otcToken', data);
        },
    });

    const onSubmit = (v) => {
        const [base_coin] = coins?.filter((c) => CoinsSelected.split('-')[0] == c.coin.symbol);
        const [quote_coin] = coins?.filter((c) => CoinsSelected.split('-')[1] === c.coin.symbol);
        if (page == 1) {
            getQuote(
                {
                    base_coin: base_coin.coin.id,
                    quote_coin: quote_coin.coin.id,
                    amount: v.amount,
                },
                {
                    onSuccess: (data: any) => {
                        setReqData({
                            amount: v.amount,
                            base: base_coin,
                            to: quote_coin,
                        });
                        setQouteData(data);
                        setPage(page + 1);
                    },
                    onError: (err: any) => {
                        toast.error(err?.data[0] && err?.data[0]);
                    },
                },
            );
        }
    };

    const handleFinishOtc = () => {
        finishQuote(
            {
                base_coin: reqData.base.coin.id,
                quote_coin: reqData.to.coin.id,
                amount: reqData.amount,
            },
            {
                onSuccess: (data) => {
                    console.log(data);
                    setPage(page + 1);
                },
                onError: (err: any) => {
                    setPage(page - 1);
                    console.log('errrrr happpended', err.data.non_field_errors[0]);
                    toast.error(err?.data && err.data.non_field_errors[0]);
                },
            },
        );
    };

    useEffect(() => {
        if (qouteData !== null && page == 2) {
            setKey(key + 1);
            getQuote(
                {
                    base_coin: reqData.base.coin.id,
                    quote_coin: reqData.to.coin.id,
                    amount: reqData.amount,
                },
                {
                    onSuccess: (data: any) => {
                        setQouteData(data);
                    },
                    onError: (err: any) => {
                        toast.error(err?.data && err.data.non_field_errors[0]);
                        // setPage(1);
                    },
                },
            );
        }
    }, [isSecondFinish]);

    // useEffect(() => {
    //     const lastbar = JSON.parse(Cookies.get('lastBarOtc'));
    //     setLastBarOtc(lastbar);
    // }, [])

    useEffect(() => {
        if (isSecondFinish) {
            setPage(1);
        }
    }, [isSecondFinish]);

    useEffect(() => {
        console.log('otcAccessToken', otcAccessToken);
    }, [otcAccessToken]);

    useEffect(() => {
        socket.on('connect', () => {
            console.log('[socket] Connected');
        });

        socket.on('disconnect', (reason) => {
            console.log('[socket] Disconnected:', reason);
        });

        socket.on('error', (error) => {
            console.log('[socket] Error:', error);
        });
    }, [otcAccessToken]);

    useEffect(() => {
        if (otcAccessToken) {
            const urlParameters = {
                symbol: `BTCUSD`,
                rate: 1,
                token: otcAccessToken && otcAccessToken,
            };
            socket.emit('get current price', urlParameters);
        }
    }, [otcAccessToken]);

    useEffect(() => {
        socket.on('get current price response', (data) => {
            const parsedData = JSON.parse(data.data);
            const bid = parseFloat(parsedData[1]);
            const ask = parseFloat(parsedData[2]);

            setBidPrice(bid);
            setAskPrice(ask);
            setSid(data.sid);
        });
    }, []);


    useEffect(() => {
        return () => {
            const stopData = {
                symbol: `BTCUSD`,
                token: otcAccessToken && otcAccessToken,
                rate: 1,
                sid: sid && sid,
            };
            console.log('SOCKET STOPED!');
            socket.emit('stop receive', stopData);
        };
    }, [])

    return (
        <>
            <div
                className={`${styles['dashboard-wrapper']} py-3 lg:flex delay-700 transition-all justify-center items-center w-full h-full text-light p-2`}
            >
                <div className="lg:w-1/2 h-96 mb-3 lg:mb-0 flex flex-col justify-center">
                    {/* <TradingView currentCoin={currentCoin} coinsList={coins_data} /> */}
                </div>

                <div
                    className={`${wPage} delay-700 transition-all mb-3 lg:mb-0 bg-main rounded-lg flex flex-col items-center justify-center p-5`}
                >
                    {page !== 3 ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                            {/* <div className="border-b border-gray-600 w-full text-gray-400 py-2">
                                <span
                                    className={`${
                                        side == 'BUY' && 'border-b-2 border-gray-250'
                                    } py-3 cursor-pointer text-sm`}
                                    onClick={() => setSide('BUY')}
                                    style={{ unicodeBidi: 'plaintext' }}
                                >
                                    {t('common:want-to-buy')}
                                </span>
                                <span
                                    onClick={() => setSide('SELL')}
                                    style={{ unicodeBidi: 'plaintext' }}
                                    className={`${
                                        side == 'SELL' && 'border-b-2 border-gray-250'
                                    }  py-3 cursor-pointer text-sm`}
                                >
                                    {t('common:want-to-sell')}
                                </span>
                            </div> */}
                            <div className=" text-center">
                                <span>bid:</span>{' '}
                                1 {CoinsSelected.split('-')[0]} = {bidPrice}{' '}
                                {CoinsSelected.split('-')[1]}
                            </div>
                            <div className=" text-center">
                            <span>ask:</span>{' '}
                                1 {CoinsSelected.split('-')[0]} = {askPrice}{' '}
                                {CoinsSelected.split('-')[1]}
                            </div>
                            <Input
                                name="amount"
                                setCoinsSelected={setCoinsSelected}
                                side={side}
                                // placeholder={side == 'BUY' ? t('common:buy') : t('common:sell')}
                                placeholder={t('common:amount')}
                                title={t('common:convert')}
                                t={t}
                                error={errors?.amount?.message}
                                register={register({ required: t('common:cannot-be_empty') })}
                                coins={coins_data}
                            />

                            <span className="my-1" />
                            {page == 2 && (
                                <>
                                    <div className="flex justify-between w-full">
                                        <span> {t('common:price')}</span>
                                        <span>
                                            1 {CoinsSelected.split('-')[0]} = {qouteData?.rate}{' '}
                                            {CoinsSelected.split('-')[1]}
                                        </span>
                                    </div>
                                    <div className="flex justify-between w-full">
                                        <span>{t('common:you-will-receive')}</span>
                                        <span className="text-main-green-600 text-lg">
                                            {qouteData?.receive_amount}
                                        </span>
                                    </div>
                                </>
                            )}

                            {page == 1 && (
                                <Button type="submit">
                                    Submit {getQuoteLoading && <LoadSpin w={15} />}
                                </Button>
                            )}
                            {page == 2 && (
                                <div className="flex justify-between w-full">
                                    <div className="w-5/12">
                                        <Button
                                            className="btn bg-muted focus-within:outline-none text-white"
                                            onClick={() => setPage(page - 1)}
                                        >
                                            {t('common:reject')}
                                        </Button>
                                    </div>
                                    <div className="w-5/12">
                                        <Button onClick={handleFinishOtc}>
                                            {t('common:accept')}
                                            <Timer
                                                key={key}
                                                initialMinute={0}
                                                initialSeconds={5}
                                                isFinish={isSecondFinish}
                                                setIsSecondFinish={setIsSecondFinish}
                                            />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    ) : (
                        <SuccessChange
                            back={() => setPage(1)}
                            t={t}
                            data={data}
                            reqData={reqData}
                        />
                    )}
                </div>
            </div>
        </>
    );
};

const _getLayout = (page) => getLayout(page, 'OTC | TalanExchange', true);

export default withAuth(OTC, _getLayout);

import { currentCoinPath } from '@store/selectors/coin';
import { useGetFees, useGetUserWallet, useSpodOrder } from 'hooks/hooks';
import useTranslation from 'next-translate/useTranslation';
import { queryClient } from 'pages/_app';
import React, { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { generateCoinSymbol, showError } from 'src/utils/index';
import styles from './style.module.css';
import { ToastContainer, toast } from 'react-toastify';
import { Range, getTrackBackground } from 'react-range';
import Wallet from 'assets/svg/wallet.svg';
import Menu from 'assets/svg/menu.svg';
import { useMutation } from 'react-query';
import Tabs from '@components/ui/Tabs/ExchangeTabs';

interface P {
    buy?: boolean;
    coins: any;
    side?: string;
}
interface CustomInputProps {
    side?: any;
    placeholder?: any;
    title?: any;
    t: any;
    register?: any;
    name?: any;
    type?: any;
    step?: any;
    min?: any;
    error?: any;
    rightTitle?: any;
}
const CustomInput: FC<CustomInputProps | any> = ({
    side,
    placeholder,
    title,
    t,
    register,
    name,
    type,
    step,
    min,
    error,
    rightTitle,
    ...oderProps
}) => {
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
                        type={type}
                        min={min}
                        step={step}
                        name={name}
                        className="focus:bg-c-secondary-800 group-hover:bg-lighten-5 hover:bg-muted-500 focus-within:bg-c-secondary-800 block w-full pl-7 pr-2 sm:text-sm rounded-md py-2 focus:outline-none bg-c-secondary-800"
                        placeholder={placeholder}
                        {...oderProps}
                    />

                    <div className={inputClass}>
                        <div className="w-full h-full p-2 text-sm font-medium text-gray-400  w- hover:bg-c-secondary-900 transition-all duration-300">
                            {rightTitle}
                        </div>
                    </div>
                </div>
            </div>
            {error && (
                <div className="w-full my-3 flex justify-start">
                    <small className={`text-xs text-red-400`}>{error}</small>
                </div>
            )}
        </>
    );
};

const ExchangeBox: FC<P> = ({ coins, side }) => {
    const data: any = queryClient.getQueryData('user-wallet');
    const { register, handleSubmit, errors, watch, reset } = useForm();
    const { t } = useTranslation();
    const { mutate: sendOrder } = useSpodOrder();
    const { mutate: getFees } = useGetFees();
    const fees: any = queryClient.getQueryData('spot-fees');

    const coins_list = generateCoinSymbol(coins);
    const [percent, setPercent] = useState(0);
    const [coinsForTrade, setCoinsForTrade] = useState<any>({ coin_id: '', to_coin: '' });
    const currentCoin = useSelector(currentCoinPath);
    const [selectedAmuont, setSelectedAmuont] = useState<any>('');
    const [selectedPrice, setSelectedPrice] = useState<any>('');

    const [rangeValue, setRangeValue] = useState<any>([0]);

    const coin = currentCoin.split('-');
    const [currentCoinData] = data?.filter((d) => d.coin.symbol == coin[0]);
    const [secondCoinData] = data?.filter((d) => d.coin.symbol == coin[1]);
    const coinFtrade = currentCoinData?.available * (watch('range') / 100);
    const onSubmit = (e: any) => {
        // console.log({ e });
        sendOrder(
            {
                price: e.price,
                amount: e.amount,
                coin: coinsForTrade.coin_id,
                side: side == 'BUY' ? 'buy' : 'sell',
                to_coin: coinsForTrade.to_coin,
            },
            {
                onSuccess: () => {
                    setTimeout(() => {
                        toast.success(
                            t('common:success-order', {
                                price: e.price,
                                from: coin[0],
                                to: coin[1],
                            }),
                            { position: 'top-center' },
                        );
                    }, 1000);
                    queryClient.prefetchQuery('user-wallet');
                    queryClient.prefetchQuery('orders');
                    queryClient.prefetchQuery('market-watch');
                    // queryClient.prefetchQuery('order-book');

                },
                onError: (e: any) => {
                    e.status === 500 ? showError({ data: t('common:error') }) : showError(e?.data);
                },
            },
        );
    };

    useEffect(() => {
        handleChange(currentCoin);
        setSelectedAmuont('');
        reset();
    }, [currentCoin]);

    useEffect(() => {
        getFees(
            {
                base_coin: 1,
                quote_coin: 2,
            },
            {
                onSuccess: (data) => {
                    queryClient.setQueryData('spot-fees', data);
                },
            },
        );
    }, []);

    useEffect(() => {
        const amountByRange =
            currentCoinData?.available == undefined
                ? ''
                : side == 'BUY'
                ? (currentCoinData?.available * rangeValue) / 100
                : (secondCoinData?.available * rangeValue) / 100;
        setSelectedAmuont(amountByRange);
    }, [rangeValue]);

    const handleChange = (e: any) => {
        const [c, tc] = e.split('-');
        const coinData = coins?.filter((coin: any) => coin.coin.symbol == c);
        const coinId = coinData[0]?.coin?.id;
        const toCoinData = coins?.filter((coin: any) => coin?.coin?.symbol == tc);
        const toCoinId = toCoinData[0]?.coin?.id;
        setCoinsForTrade({ to_coin: toCoinId, coin_id: coinId });
    };

    const handleChangeInputRange = (e) => {
        const data: any = (currentCoinData.available * e.target.value) / 100;
        setPercent(e.target.value);
        setSelectedAmuont(data);
    };
    const handleChangeAmountInp = (e) => {
        setSelectedAmuont(e.target.value);
    };


    return (
        <>
            <form className="w-full h-full flex flex-col px-5" onSubmit={handleSubmit(onSubmit)}>
                <div>
                    <div className="flex flex-col w-full">
                        <div className="flex flex-col">
                            <small className="py-1 text-gray-400 whitespace-nowrap flex flex-row">
                                {/* {t('common:available')} :{' '} */}
                                <Wallet className="w-5 h-5 fill-current text-green-white mr-4" />
                                <span className="text-sm text-light">
                                    {currentCoinData?.available == undefined
                                        ? 0
                                        : side == 'BUY'
                                        ? currentCoinData?.available
                                        : secondCoinData?.available}{' '}
                                    {currentCoin && side == 'BUY'
                                        ? currentCoin.split('-')[0]
                                        : currentCoin.split('-')[1]}
                                </span>
                            </small>
                        </div>
                    </div>
                    <div className="my-2 flex flex-col">
                        <div>
                            <CustomInput
                                name="price"
                                side={side}
                                step="any"
                                min="0"
                                type="number"
                                value={selectedPrice}
                                onChange={(e) => setSelectedPrice(e.target.value)}
                                rightTitle={currentCoin.split('-')[1]}
                                placeholder={t('common:price')}
                                title=""
                                t={t}
                                error={errors?.amount?.message}
                                register={register({ required: t('common:cannot-be_empty') })}
                            />
                        </div>
                        <div>
                            <CustomInput
                                name="amount"
                                side={side}
                                step="any"
                                min="0"
                                onChange={handleChangeAmountInp}
                                value={selectedAmuont}
                                type="number"
                                rightTitle={currentCoin.split('-')[0]}
                                placeholder={t('common:amount')}
                                title=""
                                t={t}
                                error={errors?.amount?.message}
                                register={register({ required: t('common:cannot-be_empty') })}
                            />
                        </div>
                    </div>
                </div>
                {/* <div style={{ marginBottom: 0 }} /> */}
                <small
                    style={{ marginBottom: '2rem' }}
                    className="py-1 text-gray-400 whitespace-nowrap"
                >
                    {t('common:commission')} :{' '}
                    <span className="text-sm text-light">
                        {fees && (side === 'BUY' ? fees[0]?.buyer_fee : fees[0]?.seller_fee)}
                    </span>
                </small>

                <Range
                    step={25}
                    min={0}
                    max={100}
                    values={rangeValue}
                    onChange={(values) => setRangeValue(values)}
                    renderTrack={({ props, children }) => (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                height: '36px',
                                display: 'flex',
                                width: '90%',
                                margin: '-14px auto',
                                borderRadius: '5px',
                            }}
                        >
                            <div
                                ref={props.ref}
                                style={{
                                    height: '5px',
                                    width: '100%',
                                    borderRadius: '4px',
                                    background: getTrackBackground({
                                        values: rangeValue,
                                        colors: ['#11C194', '#ccc'],
                                        min: 0,
                                        max: 100,
                                    }),
                                    alignSelf: 'center',
                                }}
                            >
                                {children}
                            </div>
                        </div>
                    )}
                    renderThumb={({ props }) => (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                // height: '12px',
                                // width: '12px',
                                // borderRadius: '50%',
                                // backgroundColor: '#000',
                                // border: '0.1rem solid #fff',
                            }}
                        />
                    )}
                    renderMark={({ props }) => (
                        <div
                            {...props}
                            style={{
                                ...props.style,
                                height: '12px',
                                width: '12px',
                                borderRadius: '50%',
                                backgroundColor: '#fff',
                                border: '0.1rem solid #fff',
                            }}
                        />
                    )}
                />
                <div className="text-center mt-5">{rangeValue}%</div>
                {/* <div style={{ margin: 2 }} />
                <div style={{ flex: 1 }} /> */}
                {/* <small className=" text-gray-400 whitespace-nowrap">
                    {t('common:total')} : <span className="text-sm text-light">0.00</span>
                </small> */}
                <CustomInput
                    name="total"
                    // value="0.0"
                    type="number"
                    rightTitle={currentCoin.split('-')[1]}
                    placeholder={t('common:total')}
                    title=""
                    value={
                        fees &&
                        (side === 'BUY'
                            ? (+fees[0]?.buyer_fee * (+selectedPrice * +selectedAmuont)) / 100 +
                              +selectedPrice * +selectedAmuont
                            : (+fees[0]?.seller_fee * (+selectedPrice * +selectedAmuont)) / 100 +
                              +selectedPrice * +selectedAmuont)
                    }
                    t={t}
                />
                {/* <div style={{ marginBottom: 3 }} />
                <div style={{ flex: 1 }} /> */}

                <button
                    className={`btn mt-1 ${
                        side == 'BUY'
                            ? 'bg-gradient-to-r focus:outline-none ring-main-green-500 from-main-green to-main-green-500'
                            : 'bg-gradient-to-r focus:outline-none from-red-600 to-red-700'
                    } hover:opacity-95`}
                    type="submit"
                >
                    {side == 'BUY' ? t('common:buy') : t('common:sell')} {currentCoin.split('-')[0]}
                </button>
            </form>
        </>
    );
};

interface ExchangeProps {
    noCaption?: boolean;
}

const Exchange:FC<ExchangeProps> = ({noCaption}) => {
    const { data }: any = useGetUserWallet();
    const { t } = useTranslation();
    // const coins_list = generateCoinSymbol(data);
    // const currentCoin = useSelector(currentCoinPath);
    // const [coinsForTrade, setCoinsForTrade] = useState<any>({ coin_id: '', to_coin: '' });

    // const handleChange = (e: any) => {
    //     const [c, tc] = e.split('-');
    //     const coinData = data?.filter((coin: any) => coin.coin.symbol == c);
    //     const coinId = coinData[0]?.coin?.id;
    //     const toCoinData = data?.filter((coin: any) => coin?.coin?.symbol == tc);
    //     const toCoinId = toCoinData[0]?.coin?.id;
    //     setCoinsForTrade({ to_coin: toCoinId, coin_id: coinId });
    // };

    return (
        <div className="w-full h-full overflow-x-auto scrollbar-none" style={{}}>
            {/* <h1 className="mb-0 px-1">{t('common:place-order')}</h1> */}
            {/* <ComboBox
                wrapperClassName="w-auto mb-2"
                title={''}
                defaultValue={currentCoin}
                data={coins_list}
                onSelectedItem={(e) => handleChange(e)}
                isLoading={false}
                renderItem={(item) => {
                    return (
                        <div className="w-full h-full p-2 flex justify-start w- hover:bg-c-secondary-900 transition-all duration-300">
                            {item}
                        </div>
                    );
                }}
                name="provinceId"
            /> */}
            {!noCaption && (
                <div className="flex flex-row px-2 py-3 mb-2  justify-items-between items-center cursor-pointer dragMe">
                    <Menu className="w-3 h-3 fill-current text-green-white mr-2" />
                    {t('common:exchange')}
                </div>
            )}
            <div className="w-full h-full">
                <Tabs
                    activeTabClassName="text-white border-white shadow-lg"
                    defaultIndex={0}
                    tabsClassName="mb-2 bg-gradient-to-r focus:outline-none ring-main-green-500 text-white"
                    tabsNames={[
                        {
                            title: t('common:buy'),
                            color:
                                'bg-gradient-to-r focus:outline-none ring-main-green-500 from-main-green to-main-green-500',
                        },
                        {
                            title: t('common:sell'),
                            color: 'bg-gradient-to-r focus:outline-none from-red-600 to-red-700',
                        },
                    ]}
                >
                    {data && <ExchangeBox coins={data} side="BUY" />}
                    {data && <ExchangeBox coins={data} side="SELL" />}
                </Tabs>
            </div>
        </div>
    );
};

export default Exchange;

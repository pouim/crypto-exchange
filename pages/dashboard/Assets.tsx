import { CheckBox } from '@components/ui';
import styles from './styles.module.css';
import { useGetUserWallet } from 'hooks/hooks';

const Assets = () => {
    const { data }: any = useGetUserWallet();
    return (
        <div className={`${styles.parent} scrollbar-none`}>
            <h1 className="mb-10">Assets</h1>

            <div className="flex items-center">
                <CheckBox />
                <span className="text-xs">Hide zero balances</span>
            </div>
            <div className="w-full text-gray-400 grid grid-cols-3 text-center">
                <small>Currency</small>
                <small>Available</small>
                <small>Total</small>
            </div>
            <div
                className={`${styles.cdk_virtual_scroll_viewport} ${styles.info_table} hide-scrollbar`}
            >
                <ul className={`${styles.cdk_virtual_scroll_content_wrapper} hide-scrollbar`}>
                    {data?.map((c: any) => (
                        <li
                            key={c.coin.created_at}
                            className="hover:bg-main hover:opacity-70 py-1 transition-all"
                        >
                            <div className="grid grid-cols-3 text-center z-10 items-center">
                                <small className="cursor-pointer text-red-500 flex items-center">
                                    <img
                                        src={c?.coin?.icon ?? '/images/eur.png'}
                                        className="h-7 w-7 mx-1 rounded-full"
                                    />
                                    <div>
                                        <span className="block">{c?.coin?.name}</span>
                                        <span className="block">ID: {c?.coin?.id}</span>
                                    </div>
                                </small>
                                <small>26,606.57</small>
                                <small>{c?.total}</small>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Assets;

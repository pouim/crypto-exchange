import styles from './styles.module.css';
const WatchList = () => {
    return (
        <div className={`${styles.parent} scrollbar-none`}>
            <div>
                <h1 className="px-4 pt-1 w-full text-center">Watch List</h1>
                <label className="block w-44 px-3">
                    <select className="form-select bg-c-secondary-700 p-1 block w-full mt-1 bg-transparent rounded-3xl outline-none">
                        <option>BTC/USD</option>
                        <option>BTC/USD</option>
                        <option>BTC/USD</option>
                        <option>BTC/USD</option>
                        <option>BTC/USD</option>
                    </select>
                </label>
            </div>
            {/* <div className="bg-main w-full p-2 items-center flex justify-between">
                <span className="text-xs">Grouping: 0</span>
                <div>
                    <button className="bg-main text-main-green px-2 rounded shadow hover:opacity-75 mx-1">
                        -
                    </button>
                    <button className="bg-main text-main-green px-2 rounded shadow hover:opacity-75 mx-1">
                        +
                    </button>
                </div>
            </div> */}
            <hr className="my-3" />
            <div className="flex justify-around text-gray-400">
                <small>Price (EUR)</small>
                <small>Price (EUR)</small>
                <small>Price (EUR)</small>
            </div>
            <div
                className={`${styles.cdk_virtual_scroll_viewport} ${styles.info_table} hide-scrollbar`}
            >
                <ul className={`${styles.cdk_virtual_scroll_content_wrapper} hide-scrollbar`}>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                    <li className="hover:bg-main hover:opacity-70 py-1 transition-all">
                        <div className="flex justify-around z-10">
                            <small className="cursor-pointer ">26,606.57</small>
                            <small>26,606.57</small>
                            <small>26,606.57</small>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default WatchList;

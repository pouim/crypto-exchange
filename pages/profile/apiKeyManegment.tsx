import { getLayout } from '@components/common/Layout';
import React from 'react';

const ApiKeyManegment = () => {
    return (
        <div>
            <div className="mb-3 px-3 py-2 bg-c-secondary-900 hover:bg-main rounded-2xl flex justify-between border-l-8 border-main-green-500">
                API Key Management #1
                <span className="rounded-full w-7 flex justify-center items-center h-7 text-center text-red-400 bg-lighten-5 cursor-pointer">
                    *
                </span>
            </div>
            <div className="mb-3 px-3 py-2 bg-c-secondary-900 hover:bg-main rounded-2xl flex justify-between border-l-8 border-main-green-500">
                API Key Management #1
                <span className="rounded-full w-7 flex justify-center items-center h-7 text-center text-red-400 bg-lighten-5 cursor-pointer">
                    *
                </span>
            </div>
            <div className="mb-3 px-3 py-2 bg-c-secondary-900 hover:bg-main rounded-2xl flex justify-between border-l-8 border-main-green-500">
                API Key Management #1
                <span className="rounded-full w-7 flex justify-center items-center h-7 text-center text-red-400 bg-lighten-5 cursor-pointer">
                    *
                </span>
            </div>
        </div>
    );
};
ApiKeyManegment.getLayout = (page) => getLayout(page, 'Api key manegment | TalanExchange', true);

export default ApiKeyManegment;

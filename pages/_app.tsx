import '@assets/styles/main.css';
import { AppProps } from 'next/app';
import { makeStore, wrapper } from '@store/index';
import { Hydrate } from 'react-query/hydration';
import { QueryClient, QueryClientProvider } from 'react-query';
// import { ReactQueryDevtools } from 'react-query/devtools';
import 'toastify-js/src/toastify.css';
import App from 'next/app';
import Layout from '@components/common/Layout';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { client } from '@gate/index';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

export const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
    const getLayout =
        Component.getLayout ||
        ((page) => (
            <Layout>
                {page}
            </Layout>
        ));
    const { asPath } = useRouter();
    const dir = useSelector((state: any) => state?.appearance?.dir);

    return (
        <>
            <ToastContainer bodyClassName={dir} />
            <QueryClientProvider client={queryClient}>
                <Hydrate state={pageProps.dehydratedState}>
                    {getLayout(<Component {...pageProps} />)}
                </Hydrate>
            </QueryClientProvider>
        </>
    );
}

MyApp.getInitialProps = async (appContext) => ({
    ...(await App.origGetInitialProps(appContext)),
});
export default wrapper.withRedux(MyApp);

import { ReactNode, useEffect, useState } from 'react';
import Head from 'next/head';
import SideBar from './SideBar';
import { useDispatch, useSelector } from 'react-redux';
import Header from './Header';
import { useRouter } from 'next/router';
import styles from './styles.module.css';
import { layout } from 'store/reducers/appearance';
import Notification from '@components/ui/Notification/Notification';
interface LayoutProps {
    children: ReactNode;
    sideBar?: boolean;
    title?: string;
    header?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, title, sideBar, header }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState({ class: styles.close });
    const [dir, setDir] = useState('ltr');
    const { locale } = useRouter();
    const dispatch = useDispatch();
    const handleOpenSideBar = () => {
        setIsSidebarOpen((prev) => ({
            class: prev.class == styles.open ? styles.close : styles.open,
        }));
    };
    const { asPath } = useRouter();
    // const dir = useSelector<any, undefined>((state) => state?.appearance?.dir);
    useEffect(() => {
        if (locale == 'IR') {
            dispatch(layout('rtl'));
            setDir('rtl');
            document.body.style.fontFamily = 'IranSans, Rubik !important';
        } else {
            dispatch(layout('ltr'));
            setDir('ltr');
        }
    }, [locale]);

    return (
        <>
            <Head>
                <title>{title}</title>
            </Head>
            <div className="flex w-full transition-all bg-main" dir={dir}>
                <div
                    // className={`relative w-full text-white mx-auto flex ${
                    //     sideBar && 'md:mx-10 lg:mx-28'
                    // }`}
                    className="relative w-full text-white mx-auto flex"
                >
                    <div className="w-full min-h-screen bg-main flex justify-between">
                        {asPath !== '/auth' && <Notification />}
                        {sideBar && <SideBar />}
                        <div className={`w-full ${asPath !== '/auth' && 'bg-c-secondary-800'}`}>
                            {header && <Header title={title} />}
                            <div className={`w-full ${asPath !== '/help-desk' && 'lg:px-5'} }`}>
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export const getLayout = (
    page: ReactNode,
    title: string = 'title',
    sidebar: boolean = true,
    header: boolean = true,
) => <Layout sideBar={sidebar} children={page} title={title} header={header} />;
export default Layout;

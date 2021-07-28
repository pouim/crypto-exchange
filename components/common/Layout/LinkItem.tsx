import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import styles from './styles.module.css';
interface LinkProps
    extends React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement> {
    name: string;
    link?: string;
    children?: ReactNode;
    click?: VoidFunction;
    oderProps?: any;
    normal?: boolean;
}

const LinkItem: FC<LinkProps> = ({ normal = false, name, link, children, click, ...oderProps }) => {
    const dir = useSelector((state: any) => state?.appearance?.dir);
    const sideBar = useSelector((state: any) => state?.appearance?.sideBar);

    const { asPath, push } = useRouter();

    let ActiveClassName =
        asPath !== link
            ? 'text-gray-500'
            : dir == 'ltr'
            ? 'border-l-4 border-main-green-600'
            : 'border-r-4 border-main-green-600';

    return (
        <li
            {...oderProps}
            className={`my-7 flex px-5 ${
                ActiveClassName ?? 'text-gray-500'
            } hover:text-white transition-all cursor-pointer items-center`}
        >
            {children && children}
            {(sideBar == 'MEDIUM' || sideBar == 'CLOSE') && (
                <span style={{ margin: '0 5px' }}>{name}</span>
            )}

        </li>
    );
};
export default LinkItem;

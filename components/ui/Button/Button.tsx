import React, { ClassType, DetailedHTMLProps, FC, ReactNode } from 'react';
import { LoadingSpin } from '..';
export interface ButtonProps
    extends DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    children?: ReactNode;
    classBtn?: string;
    loading?: boolean;
}
const Button: FC<ButtonProps> = ({ children, classBtn, loading, ...otherProps }) => {
    return (
        <button
            className={`bg-gradient-to-r whitespace-nowrap from-main-green to-main-green-500 hover:opacity-90 focus:outline-none btn flex text-center justify-center items-center ${classBtn}`}
            {...otherProps}
        >
            {loading && <LoadingSpin w={20} />}
            {children}
        </button>
    );
};

export default Button;

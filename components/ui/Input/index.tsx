import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import styles from './style.module.css';

interface Props
    extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    placeholder?: string;
    labelClassName?: string;
    register?: any;
    error?: any;
}

const Input: FC<Props> = ({ placeholder, labelClassName, register, error, ...oderProps }) => {
    const dir = useSelector((state: any) => state?.appearance?.dir);
    return (
        <>
            <label className={`${styles.field} ${styles.field_v2} ${labelClassName}`}>
                <input
                    className={`${styles.field__input} outline-none focus-within:bg-main`}
                    placeholder={placeholder}
                    ref={register}
                    {...oderProps}
                    dir={dir}
                    autoComplete="off"
                />
                <span
                    className={`${styles.field__label_wrap} ${dir == 'ltr' ? 'left-0' : 'right-0'}`}
                >
                    <span
                        className={`${styles.field__label} ${
                            dir == 'ltr' ? 'left-0' : 'right-0 text-right'
                        } text-gray-500`}
                    >
                        {placeholder}
                    </span>
                </span>
            </label>
            {error && (
                <div className="w-full flex justify-start">
                    <small className={`text-xs text-red-400`}>{error?.message}</small>
                </div>
            )}
        </>
    );
};

export default Input;

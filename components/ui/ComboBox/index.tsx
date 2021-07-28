import React, { FC, ReactElement, useEffect, useState } from 'react';
import styles from './style.module.css';
import cn from 'classnames';
import { DropDown } from '..';
import LoadSpin from '../Loading/LoadingSpin';
import { useSelector } from 'react-redux';
interface Props
    extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    placeholder?: string;
    labelClassName?: string;
    color?: string;
    register?: any;
    className?: string;
    wrapperClassName?: string;
    customStyle?: any;
    error?: string;
    isLoading: boolean;
    title: string;
    data: any[];
    onSelectedItem: (item: any) => any;
    renderItem: (item: any, index: number) => ReactElement;
}
let key = 0;
const ComboBox: FC<Props> = ({
    title,
    className,
    data,
    wrapperClassName,
    labelClassName,
    customStyle,
    isLoading,
    onSelectedItem,
    register,
    error,
    renderItem,
    color,
    ...otherProps
}) => {
    const [filteredData, setFilteredData] = useState(data ?? []);
    const dir = useSelector((state: any) => state?.appearance?.dir);

    const [_value, setValue] = useState<string>(otherProps.defaultValue as string);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e?.target?.value ?? e;
        setValue(value.toUpperCase());
    };
    useEffect(() => {
        setValue(otherProps.defaultValue as string);
    }, [otherProps.defaultValue]);
    const [open, setOpen] = useState<boolean>(false);

    useEffect(() => {
        const _data = data?.filter((item) => item?.includes(_value));
        setFilteredData(_data);
    }, [_value]);

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    return (
        <div className={`relative ${wrapperClassName}`}>
            <input
                disabled={isLoading || !data?.length}
                ref={register}
                autoComplete="off"
                onClick={() => setOpen(!open)}
                id={otherProps.name}
                className={cn(
                    customStyle ? customStyle : styles.input,
                    error && styles.error,
                    className,
                    `z-30 relative ${
                        color ? color : 'bg-main focus:bg-main'
                    } focus-within:outline-none focus:outline-none outline-none uppercase`,
                )}
                {...otherProps}
                pattern=".+"
                value={_value}
                onChange={onChange}
                required
            />

            <label
                className={cn(styles.label, error && styles.error, labelClassName, 'z-50')}
                htmlFor={otherProps.name}
            >
                {title}
            </label>

            {error && (
                <div className="text-xs px-4 h-5 flex items-center overflow-hidden text-right text-red-600">
                    {error}
                </div>
            )}

            <div
                className={
                    customStyle
                        ? `absolute ${
                              dir == 'ltr' ? 'right-2' : 'left-2'
                          }  top-5 z-40 flex justify-center items-center w-5 h-5`
                        : `absolute ${
                              dir == 'ltr' ? 'right-2' : 'left-2'
                          }  top-2 z-40 flex justify-center items-center w-5 h-5`
                }
            >
                {isLoading ? (
                    <LoadSpin />
                ) : (
                    <div
                        onClick={() => setOpen(!open)}
                        className={cn(
                            'w-2 h-2  border-b transition-all  cursor-pointer duration-300 border-r transform  border-gray-400',
                            open ? 'rotate-224' : 'rotate-45',
                        )}
                    />
                )}
            </div>
            <DropDown
                style={{ top: -15, zIndex: 60 }}
                heightClassName="w-40 top-10 rounded-md"
                visible={open}
                onClose={() => setOpen(false)}
            >
                <div className="overflow-y-scroll bg-main max-h-72 text-sm custom_scrollbar">
                    {filteredData?.map((item, index) => {
                        key++;
                        return (
                            <div
                                onClick={() => {
                                    setValue(item);
                                    onSelectedItem(item);
                                    setOpen(false);
                                }}
                                key={key}
                                className="w-full"
                            >
                                {renderItem(item, index)}
                            </div>
                        );
                    })}
                </div>
            </DropDown>
        </div>
    );
};

export default ComboBox;

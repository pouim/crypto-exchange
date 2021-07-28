import React, { CSSProperties, ReactNode } from 'react';
import cn from 'classnames';
export interface DropdownProps {
    heightClassName?: string;
    chidren?: ReactNode;
    visible: boolean;
    className?: string;
    style?: CSSProperties;
    onClose: VoidFunction;
}

const Dropdown: React.FC<DropdownProps> = ({
    children,
    visible,
    style,
    onClose,
    className,
    heightClassName = 'h-max-content',
}) => {
    return (
        <>
            {visible && (
                <div
                    onClick={() => onClose()}
                    className="z-0  fixed max-w-screen h-screen right-0 top-0 left-0 bottom-0 bg-transparent"
                />
            )}
            <div style={style} className="absolute">
                <div
                    className={cn(
                        'absolute transition-all z-20 overflow-hidden',
                        visible ? `opacity-100 ${heightClassName}` : 'h-0  opacity-0',
                        className,
                    )}
                >
                    {children}
                </div>
            </div>
        </>
    );
};

export default Dropdown;

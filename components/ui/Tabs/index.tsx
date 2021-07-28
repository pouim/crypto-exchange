import React, { Children, FC, ReactNode, useState } from 'react';
interface TabsProps {
    children?: ReactNode;
    tabsNames: string[];
    defaultIndex?: number;
    activeTabClassName?: string;
    tabClassName?: string;
    bgColor?: string;
    tabsClassName?: string;
}

const Tabs: FC<TabsProps> = ({
    children,
    tabsNames = [],
    activeTabClassName,
    bgColor,
    defaultIndex = 0,
    tabClassName,
    tabsClassName,
}) => {
    const [openTab, setOpenTab] = useState<number>(defaultIndex);
    const activeTabBgColor = bgColor ? bgColor : 'bg-c-secondary-900';

    return (
        <div className="w-full contents">
            <div
                className={`flex transition-all justify-around rounded-t-lg bg-main text-gray-400 cursor-pointer items-center ${tabsClassName}`}
            >
                {tabsNames.map((tab, key) => {
                    return (
                        <div
                            key={key}
                            onClick={() => setOpenTab(key)}
                            className={`text-center transition-all text-xs md:text-sm ${
                                key === openTab ? activeTabBgColor : 'bg-main'
                            } py-3 w-full rounded-t-lg ${tabClassName}  ${
                                key === openTab && activeTabClassName
                            } `}
                        >
                            {tab}
                        </div>
                    );
                })}
            </div>

            <div className="w-full h-5/6">
                {Children.map(children, (Child, key) => {
                    if (openTab === key) return <>{Child}</>;
                })}
            </div>
        </div>
    );
};
export default Tabs;

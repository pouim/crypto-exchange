import React, { FC, JSXElementConstructor } from 'react';

interface Props
    extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    labelText?: React.ReactNode;
    register?: any;
    name?: string;
}

const index: FC<Props> = ({ children, register, name, ...oderProps }) => {
    return (
        <label className="flex justify-start items-start">
            <div className="bg-transparent border-2 rounded border-gray-400 w-5 h-5 flex flex-shrink-0 justify-center items-center mr-2 focus-within:border-blue-500">
                <input
                    type="checkbox"
                    className="opacity-0 absolute cursor-pointer"
                    name={name}
                    ref={register}
                    {...oderProps}
                />
                <svg
                    className="fill-current hidden w-4 h-4 text-green-500 pointer-events-none"
                    viewBox="0 0 20 20"
                >
                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                </svg>
            </div>
            <div className="select-none text-justify">{children}</div>
        </label>
    );
};

export default index;

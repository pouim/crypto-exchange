import React, { FC, useEffect, useRef, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { useForm } from 'react-hook-form';

import { useGetUser, useUpdateUserInfo, useUpdateUserNumberComplete, useUpdateUserNumberReq } from 'hooks/hooks';
import { queryClient } from 'pages/_app';
import UploadFiles from './UploadFiles';

import { getLayout } from '@components/common/Layout';
import withAuth from 'src/helpers/withAuth';
import { useDispatch, useSelector } from 'react-redux';
import { logOut } from '@store/actions';

import Profile from 'assets/svg/profile.svg';
import DoneSvg from 'assets/svg/done.svg';
import CloseSvg from 'assets/svg/close.svg';
import PhenSvg from 'assets/svg/phen.svg';
import LogOutSvg from 'assets/svg/log-out.svg';
import gate from '@gate/index';
import { useMutation } from 'react-query';
import { Button, Input, Modal } from '@components/ui';
import { OTP } from '@interfaces/index';
import { showError } from 'src/utils';
import { ToastContainer, toast } from 'react-toastify';

import { setPhoneNumber } from '@store/reducers/appearance';

const Setting = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { data }: any = useGetUser();
    const { mutate: logOutUser } = useMutation(gate.logOut);
    const { mutate: updateInfo } = useUpdateUserInfo();
    const { mutate: updateUserNumberReq } = useUpdateUserNumberReq();
    const { mutate: updateUserNumberComplete } = useUpdateUserNumberComplete();


    const [showModal, setShowModal] = useState(false);

    interface EditableInput {
        title: string;
        name: string;
        detail: string | any;
        isPhone?: boolean;
    }

    const onStartEditPhoneNumber = (data) => {
        updateUserNumberReq(data, {
            onSuccess: (res) => {
                console.log('edit number req started', res);
                dispatch(setPhoneNumber(data.phone_number))
                setShowModal(true);
                
            },
            onError: (data: any) => {
                showError(data.data, { color: 'red', gravity: 'bottom', position: 'left' });
            },
        });
    };

    const Editable: FC<EditableInput> = ({ title, detail, name, isPhone }) => {
        const { register, handleSubmit, errors } = useForm();
        const [isEditable, setIsEditable] = useState(false);
        const ouSubmit = (values: any) => {
            const { phone_number } = data;
            if (values?.phone_number) values;
            else values.phone_number = phone_number;
            isPhone
                ? onStartEditPhoneNumber(values)
                : updateInfo(values, {
                      onSuccess: (data) => {
                          queryClient.invalidateQueries('user-info');
                      },
                      
                  });
        };

        return (
            <>
                <span className="text-gray-500 text-xs lg:text-sm">{title}</span>
                <form onSubmit={handleSubmit(ouSubmit)} className="contents">
                    <input
                        ref={register}
                        className={
                            isEditable
                                ? 'text-gray-100 bg-transparent border-b-2 text-xs lg:text-sm border-gray-500 outline-none'
                                : 'text-white bg-transparent outline-none text-xs lg:text-sm'
                        }
                        defaultValue={detail}
                        name={name}
                        disabled={!isEditable}
                        autoFocus
                    />
                    {isEditable ? (
                        <div className="flex">
                            <CloseSvg
                                className="w-4 h-4 fill-current text-red-600 m-2 cursor-pointer"
                                onClick={() => setIsEditable((prev) => !prev)}
                            />
                            <button className="flex" type="submit">
                                <DoneSvg className="w-4 h-4 fill-current text-white m-2 cursor-pointer" />
                            </button>
                        </div>
                    ) : (
                        <PhenSvg
                            className="w-3 mx-3 h-3 fill-current text-white cursor-pointer"
                            onClick={() => setIsEditable((prev) => !prev)}
                        />
                    )}
                </form>
            </>
        );
    };

    const { register, handleSubmit, errors } = useForm();
    const {phone_number} = useSelector((state: any) => state.appearance)
    const onSubmit = (values: OTP) => {
        const body = {
            code: values?.code,
            phone_number: phone_number,
        }
        updateUserNumberComplete(body, {
            onSuccess: (res) => {
                console.log('user number updated!', res);
                queryClient.invalidateQueries('user-info');
                setShowModal(false);
                setTimeout(() => {
                    toast.success(
                        t('common:success-number-updated'),
                        { position: 'top-center' },
                    );
                }, 1000);
            },
            onError: (data: any) => {
                showError(data.data, { color: 'red', gravity: 'bottom', position: 'left' });
            },
        })
        // signUpComplete(data, { onSuccess: () => backToSignInPage() });
    };


    return (
        <>
            <Modal onClose={() => setShowModal(false)} visible={showModal}>
                <form
                    style={{
                        background: '#1F2A32',
                        borderRadius: '15px',
                        boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
                    }}
                    className="p-10 lg:px-20 text-light"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="flex-col p-5 grid grid-cols-1 grid-flow-row gap-2 justify-items-center w-full">
                        <div className="mb-5 w-full">
                            <Input
                                placeholder={t('common:otp-code')}
                                labelClassName="mb-1"
                                name="code"
                                register={register({ required: t('common:cannot-be_empty') })}
                                type="number"
                                error={errors?.code}
                            />
                            <span
                                className="text-sm font-light cursor-pointer text-left"
                                onClick={() => {}}
                            >
                                {t('common:resend-code')}
                            </span>
                            <span className="text-sm font-light">180s</span>
                        </div>
                        <Button loading={false}>{t('common:edit-phone-number')}</Button>
                    </div>
                </form>
            </Modal>
            <div>
                <div className="bg-main w-full lg:p-5 p-3 rounded-lg mb-10 items-center">
                    <div className="flex justify-between items-center pb-3">
                        <div className="flex items-center">
                            <Profile className="w-5 h-5 fill-current text-white m-2" />
                            {t('common:personal-info')}
                        </div>
                        <button
                            className="outline-none focus-within:outline-none"
                            onClick={() => {
                                logOutUser('d', {
                                    onSuccess: () => {
                                        dispatch(logOut());
                                    },
                                });
                            }}
                        >
                            <LogOutSvg className="w-5 h-5 fill-current text-white m-2 hover:text-main-green transition-all" />
                            {/* {t('common:log-out')} */}
                        </button>
                    </div>
                    <hr className="border-gray-500" />
                    <div className="md:flex w-full py-3">
                        <div
                            className="grid lg:w-1/2 items-center gap-y-3 mb-3"
                            style={{ gridTemplateColumns: '1fr 1.5fr 1fr' }}
                        >
                            <Editable
                                name="first_name"
                                title={t('common:first-name')}
                                detail={data?.first_name}
                            />
                            <Editable
                                name="last_name"
                                title={t('common:last-name')}
                                detail={data?.last_name}
                            />
                            <Editable
                                name="phone_number"
                                title={t('common:phone')}
                                detail={data?.phone_number}
                                isPhone={true}
                            />
                        </div>
                        <div
                            className="grid grid-rows-3 lg:w-1/2 items-center justify-between gap-y-3"
                            style={{ gridTemplateColumns: '1fr 1.5fr 1fr' }}
                        >
                            <Editable
                                name="country"
                                title={t('common:country')}
                                detail={data?.country}
                            />
                            <Editable name="email" title={t('common:email')} detail={data?.email} />
                        </div>
                    </div>
                </div>
                <div className="bg-main w-full lg:p-5 p-3 rounded-lg mb-10">
                    <div className="flex items-center pb-3">
                        <Profile className="w-5 h-5 fill-current text-white m-2" />
                        {t('common:verified-documents')}
                    </div>
                    <hr className="border-gray-500 my-2" />
                    <UploadFiles />
                </div>
            </div>
        </>
    );
};

const _getLayout = (page) => getLayout(page, 'Setting | TalanExchange', true);

export default withAuth(Setting, _getLayout);

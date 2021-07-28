import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import useTranslation from 'next-translate/useTranslation';
import { Button, Input } from '@components/ui';

import { useForgetPass, useReqForgetPass } from 'hooks/hooks';
import style from './style.module.css';

interface Props {
    backToSignInPage: Function;
}

const ForgetPass: FC<Props> = ({ backToSignInPage }) => {
    const { t } = useTranslation();
    const [page, setPage] = useState(1);
    const { register, handleSubmit, reset, errors } = useForm();
    const { mutate: requestForgetPass } = useReqForgetPass();
    const { mutate: forgetPass } = useForgetPass();

    const onSubmit = async (values: any) => {
        if (page == 1) {
            const { phone } = values;
            await requestForgetPass(
                { phone_number: phone },
                {
                    onSuccess: () => {
                        setPage(2);
                        reset();
                    },
                },
            );
        } else {
            forgetPass(
                { code: values.phone, new_password: values.password },
                {
                    onSuccess: () => {
                        backToSignInPage();
                    },
                },
            );
        }
    };

    return (
        <div className={style.card}>
            <form className="px-10 lg:px-20" onSubmit={handleSubmit(onSubmit)}>
                <div className="my-3">
                    <span className="block text-2xl font-light mb-2">
                        {t('common:forget-password')}
                    </span>
                    <small className="text-gray-500">to access your account</small>
                </div>
                <div className="flex-col p-5 grid grid-cols-1 grid-flow-row gap-2 justify-items-center w-full">
                    <div className="mb-5 w-full">
                        <Input
                            autoComplete="false"
                            placeholder={page == 1 ? 'Phone Number' : 'Code'}
                            labelClassName="mb-1"
                            name="phone"
                            register={register({ required: t('common:cannot-be_empty') })}
                            error={errors.phone}
                            type="mobile"
                        />
                        {page == 2 && (
                            <Input
                                placeholder="new password"
                                labelClassName="mb-1"
                                name="password"
                                register={register({ required: t('common:cannot-be_empty') })}
                                error={errors.password}
                                type="password"
                            />
                        )}
                    </div>
                    <Button type="submit">{t('common:continue')}</Button>
                </div>
            </form>
        </div>
    );
};

export default ForgetPass;

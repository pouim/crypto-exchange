import { Button, Input } from '@components/ui';
import { useSignIn } from 'hooks/hooks';
import useTranslation from 'next-translate/useTranslation';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import style from './style.module.css';
import { LoginRequest } from 'interfaces';
import { useQueryClient } from 'react-query';
interface Props {
    setPage?: any;
}

const SignIn: FC<Props> = ({ setPage }) => {
    const { t } = useTranslation();
    const q = useQueryClient();
    const { register, handleSubmit, errors } = useForm<LoginRequest>();
    const { mutate: signIn, isLoading } = useSignIn();

    const onSubmit = (values: LoginRequest) => {
        signIn(values);
    };

    return (
        <div className={style.card}>
            <form className="px-10 lg:px-20 text-light" onSubmit={handleSubmit(onSubmit)}>
                <div className="my-3">
                    <span className="block text-2xl font-light mb-2">{t('common:sign-in')}</span>
                    <small className="text-gray-500">{t('common:access-your-account')}</small>
                </div>

                <div className="flex-col p-5 grid grid-cols-1 grid-flow-row gap-2 justify-items-center w-full">
                    <div className="mb-5 w-full">
                        <Input
                            placeholder={t('common:phone-number')}
                            labelClassName="mb-1"
                            name="phone_number"
                            register={register({ required: t('common:cannot-be_empty') })}
                            type="mobile"
                            error={errors?.phone_number}
                        />
                        <Input
                            placeholder={t('common:password')}
                            labelClassName="mb-1"
                            name="password"
                            register={register({ required: t('common:cannot-be_empty') })}
                            type="password"
                            error={errors?.password}
                        />
                    </div>
                    <Button loading={isLoading}>{t('common:sign-in')}</Button>
                    <span className="text-main-green mt-5 cursor-pointer" onClick={() => setPage()}>
                        {t('common:is-forget-password')}
                    </span>
                </div>
            </form>
        </div>
    );
};

export default SignIn;

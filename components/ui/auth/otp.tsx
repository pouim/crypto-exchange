import { Button, Input } from '@components/ui';
import { useSignUpComplete } from 'hooks/hooks';
import useTranslation from 'next-translate/useTranslation';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import style from './style.module.css';
import { LoginRequest, OTP } from 'interfaces';
import { useQueryClient } from 'react-query';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthPage } from '@store/reducers/appearance';
interface Props {
    setPage?: any;
    wasSignin?: boolean;
    backToSignInPage: Function;
}

const Otp: FC<Props> = ({ setPage, wasSignin, backToSignInPage }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const q = useQueryClient();
    const { register, handleSubmit, errors } = useForm<OTP>();
    const { mutate: signUpComplete, isLoading } = useSignUpComplete();
    const [timer, setTimer] = useState(180);
    const {phone_number} = useSelector((state: any) => state.appearance);

    const onSubmit = (values: OTP) => {
        const data = {
            code: values?.code,
            phone_number: phone_number,
        }
        signUpComplete(data, { onSuccess: () => backToSignInPage() });
    };
    useEffect(() => {
        if (timer === 0) {
            setTimer(180);
        } else {
            setTimeout(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
    }, [timer]);

    return (
        <div className={style.card}>
            <form className="px-10 lg:px-20 text-light" onSubmit={handleSubmit(onSubmit)}>
                <div className="my-3">
                    <span className="block text-2xl font-light mb-2">
                        {wasSignin ? t('common:sign-in') : t('common:sign-up')}
                    </span>
                    <small className="text-gray-500">{t('common:access-your-account')}</small>
                </div>

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
                            onClick={() => setPage()}
                        >
                            {t('common:resend-code')}
                        </span>
                        <span className="text-sm font-light">{timer}s</span>
                    </div>
                    <Button loading={isLoading}>
                        {wasSignin ? t('common:sign-in-now') : t('common:sign-up-now')}
                    </Button>
                    <span className="text-main-green mt-5 cursor-pointer" onClick={() => setPage()}>
                        {t('common:is-forget-password')}
                    </span>
                </div>
            </form>
        </div>
    );
};

export default Otp;

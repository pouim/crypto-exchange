import { Button, CheckBox, ComboBox, Input } from '@components/ui';
import React, { FC, useState } from 'react';
import style from './style.module.css';
import { useForm } from 'react-hook-form';
import { useSignUp } from 'hooks/hooks';
import { removeEmpty } from 'src/utils';
import { RegisterRequest } from 'interfaces';
import useTranslation from 'next-translate/useTranslation';
import { useDispatch } from 'react-redux';
import { setPhoneNumber } from '@store/reducers/appearance';





interface Props {
    backToSignInPage: Function;
}

const SignUp: FC<Props> = ({ backToSignInPage }) => {
    const dispatch = useDispatch();
    const [selectedCountry, setSelectedCountry] = useState("Germany");
    const [selectedLang, setSelectedLang] = useState('EN');
    const { t } = useTranslation();
    const { register, handleSubmit, errors } = useForm<RegisterRequest>({
        reValidateMode: 'onChange',
    });
    const { mutate: signUp, isLoading } = useSignUp();
    const handleOnSubmit = (values: RegisterRequest) => {
        const data: any = removeEmpty(values);
        signUp(data);
        dispatch(setPhoneNumber(values.phone_number));
                
    };


    const SelectableInput = ({placeholder, name, type, register, data, defaultValue, onSelectedItem}) => {
        return (
            <ComboBox 
              title= {placeholder}
              name={name}
              placeholder={placeholder}
              customStyle={style.field__input}
              register={register}
              data={data}
              isLoading= {false}
              wrapperClassName="my-2"
              className="outline-none focus-within:bg-main"
              defaultValue={defaultValue}
              onSelectedItem={onSelectedItem}
              renderItem={(item) => {
                return (
                    <div className="w-full h-full p-2 flex justify-start w- hover:bg-c-secondary-900 transition-all duration-300">
                        {item}
                    </div>
                );
            }}
            />
    
        );
    };


    return (
        <div className={style.card}>
            <form className="px-10 lg:px-20" onSubmit={handleSubmit(handleOnSubmit)}>
                <span className="block text-2xl font-light mb-2">{t('common:sign-in')}</span>
                <small className="text-gray-500">{t('common:access-your-account')}</small>
                <div className="flex-col p-5 grid grid-cols-1 grid-flow-row gap-2 justify-items-center w-full">
                    <div className="mb-5 w-full">
                        <Input
                            placeholder={t('common:first-name')}
                            labelClassName="mb-1"
                            name="first_name"
                            type="text"
                            register={register}
                        />
                        <Input
                            placeholder={t('common:last-name')}
                            labelClassName="mb-1"
                            name="last_name"
                            type="text"
                            register={register}
                        />
                        <Input
                            placeholder={t('common:email')}
                            labelClassName="mb-1"
                            name="email"
                            type="email"
                            register={register}
                        />
                        <Input
                            placeholder={t('common:password')}
                            labelClassName="mb-1"
                            name="password"
                            type="password"
                            register={register({ required: t('common:cannot-be_empty') })}
                            error={errors?.password}
                        />
                        <Input
                            placeholder={t('common:phone')}
                            labelClassName="mb-1"
                            name="phone_number"
                            type="mobile"
                            register={register({
                                required: t('common:cannot-be_empty'),
                            })}
                            error={errors?.phone_number}
                        />
                        {/* <Input
                            placeholder={t('common:country')}
                            labelClassName="mb-1"
                            name="country"
                            type="text"
                            register={register}
                        /> */}
                        <SelectableInput
                            placeholder={t('common:country')}
                            name="country"
                            type="text"
                            register={register}
                            data={['Germany', 'United States']}
                            defaultValue={selectedCountry}
                            onSelectedItem={(item) => setSelectedCountry(item)}
                        />
                        <SelectableInput
                            placeholder={t('common:communication-lang')}
                            name="communication_lang"
                            type="text"
                            register={register}
                            data={['EN', 'FA']}
                            defaultValue={selectedLang}
                            onSelectedItem={(item) => setSelectedLang(item)}
                        />
                        {/* <Input
                            placeholder={t('common:communication-lang')}
                            labelClassName="mb-1"
                            name="communication_lang"
                            type="text"
                            register={register}
                        /> */}
                    </div>
                    <Button loading={isLoading}>{t('common:sign-up')}</Button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;

import { Button, Input } from '@components/ui';
import gate from '@gate/index';
import useTranslation from 'next-translate/useTranslation';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'src/utils';
import Back from 'assets/svg/back.svg';
const CreateTicket = ({ back }) => {
    const { register, handleSubmit, reset, errors } = useForm();
    const { mutate: createTicket, isLoading } = useMutation(gate.createTicket);
    const { t } = useTranslation();

    const onSubmit = (value) => {
        const { subject, describe } = value;
        createTicket(
            { subject, describe },
            {
                onSuccess: () => {
                    toast(t('common:ticket-created'));
                    back();
                },
            },
        );
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="h-screen flex-col justify-between flex w-full lg:w-4/12 bg-main p-5"
        >
            <div>
                <div className="flex items-center my-3">
                    <Back
                        className="text-xs fill-current text-white w-5 h-5 hover:opacity-70 cursor-pointer"
                        onClick={() => back()}
                    />
                </div>
                <Input
                    register={register({ required: t('common:cannot-be_empty') })}
                    placeholder="Subject"
                    name="subject"
                    title="Subject"
                    labelClassName="mb-5"
                    error={errors.subject}
                />
                <textarea
                    ref={register({ required: t('common:cannot-be_empty') })}
                    className={`${
                        errors?.describe && 'placeholder-red-400'
                    } bg-transparent border-b text-sm border-gray-400 outline-none w-full`}
                    placeholder={errors.describe ? errors?.describe?.message : 'Describe'}
                    name="describe"
                    title="Describe"
                />
            </div>
            <div className="bottom-0">
                <Button type="submit" loading={isLoading}>
                    {t('common:create-ticket')}
                </Button>
            </div>
        </form>
    );
};
export default CreateTicket;

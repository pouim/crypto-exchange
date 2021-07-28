import { useMutation } from 'react-query';
import { useForm } from 'react-hook-form';
import { queryClient } from 'pages/_app';
import { Button, LoadingSpin } from '@components/ui';
import useTranslation from 'next-translate/useTranslation';
import gate from '@gate/index';
import Attachment from 'assets/svg/attachment.svg';
import { FC, useEffect, useRef, useState } from 'react';
import Back from 'assets/svg/back.svg';
import Moment from 'react-moment';

interface Props {
    ticketNumber: any;
    handleShowMessage?: any;
    showBackBtn?: boolean;
}

const MessageCard: FC<Props> = ({ ticketNumber, handleShowMessage, showBackBtn = false }) => {
    const { mutate: getMsg, data }: any = useMutation(gate.messages);
    const tickets: any = queryClient.getQueryData('tickets');
    const messagesEndRef: any = useRef();
    const ticket = tickets?.filter((t) => t.id == ticketNumber);
    const [text, setText] = useState('');
    const { mutate: sendMessage, isLoading } = useMutation(gate.sendMessages);
    const { mutate: reqComplateTicket, isLoading: closeTicketLoading } = useMutation(
        gate.complateTicket,
    );
    const { register, handleSubmit, reset, errors, watch } = useForm();

    const [files, setFiles] = useState<any>([]);
    const { t } = useTranslation();

    const onSubmit = (value) => {
        const { attachment, text } = value;
        let formData = new FormData();
        attachment[0] && formData.append('attachment', attachment[0]);
        formData.append('text', text);
        formData.append('ticket', ticket[0].id);

        sendMessage(formData, {
            onSuccess: () => {
                reset();
                getMsg(ticketNumber);
                queryClient.prefetchQuery('tickets');
                scrollToBottom();
                setFiles([]);
            },
        });
    };

    const scrollToBottom = () => {
        messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleUploadChange = (e) => {
        [...e.target.files]?.map((i) => {
            setFiles([URL.createObjectURL(i)]);
        });
    };

    useEffect(() => {
        getMsg(ticketNumber);
    }, [ticketNumber]);

    const handleCloseTicket = () => {
        const formData: FormData = new FormData();
        const bool: any = !ticket[0]?.complete;
        formData.append('complete', bool);
        reqComplateTicket(
            { id: ticket[0]?.id, data: formData },
            {
                onSuccess: (data) => {
                    queryClient.prefetchQuery('message');
                    queryClient.prefetchQuery('tickets');
                },
            },
        );
    };

    const handleSetText = (e) => {
        setText(e.target.value);
    };
    return (
        <section className="h-screen relative transition-all flex-col items-center justify-between flex w-full lg:w-8/12">
            <div className="overflow-x-hidden overscroll-y-auto h-screen absolute hide-scrollbar transition pt-5 flex flex-col justify-between w-full">
                {!!showBackBtn && (
                    <div className="w-full p-3 ">
                        <Back
                            className="fill-current text-white cursor-pointer w-5 h-5"
                            onClick={() => handleShowMessage()}
                        />
                    </div>
                )}
                <div className="mx-3">
                    {ticket && (
                        <div className="bg-muted-500 transition-all relative p-4 my-3 rounded-t-xl w-full lg:w-9/12">
                            <div className="flex justify-between my-2">
                                <div className="flex text-sm">
                                    <span className="text-main-green">
                                        {t('common:ID')}: {ticket[0]?.id} |{' '}
                                    </span>{' '}
                                    <span className="mx-2">{ticket[0]?.subject}</span>
                                </div>
                                <div className="w-40">
                                    <Button
                                        onClick={handleCloseTicket}
                                        loading={closeTicketLoading}
                                    >
                                        {ticket && ticket[0]?.complete == false
                                            ? t('common:complete')
                                            : t('common:reopened')}
                                    </Button>
                                </div>
                            </div>
                            <p className="my-3">{ticket[0]?.describe}</p>
                            <div className="flex justify-between">
                                {/* <button className="py-1 text-sm px-4 rounded-lg bg-muted my-2">
                                    Resolved
                                </button> */}
                                <small className="text-gray-400">
                                    <Moment date={ticket[0]?.created_at} fromNow />
                                </small>
                            </div>
                        </div>
                    )}

                    {data?.map((m) => (
                        <div
                            key={m.created_at}
                            className={`bg-muted-500 transition-all p-4 my-3 rounded-t-xl w-9/12 ${
                                m?.is_current_user == true ? 'float-right' : 'float-left'
                            }`}
                        >
                            <div className="flex justify-between my-3">
                                <small className="text-gray-400">Re: {m.ticket} </small>
                                <small className="text-gray-400">
                                    <Moment date={m.created_at} fromNow />
                                </small>
                            </div>
                            <div className="flex justify-between">
                                {m?.attachment && (
                                    <img
                                        src={`${m?.attachment}/?token=a37cc1fa30fb607b2f2aef80c0c97e5220ce7aae`}
                                        width={120}
                                        height={60}
                                        className="rounded-lg"
                                    />
                                )}
                                <p className="text-gray-200 text-sm">{m.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div ref={messagesEndRef}></div>

                {ticket && ticket[0]?.complete == false && (
                    <div className="py-3 bottom-0 sticky bg-c-secondary-900">
                        <form
                            className="w-full flex justify-between px-2"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <textarea
                                ref={register({ required: t('common:cannot-be_empty') })}
                                name="text"
                                onChange={handleSetText}
                                style={{ resize: 'none' }}
                                className={`p-2 hide-scrollbar min-h-10 ${
                                    errors?.text && 'placeholder-red-400'
                                } text-sm bg-c-secondary-800 w-9/12 outline-none`}
                                placeholder={errors?.text ? errors?.text?.message : 'Your reply'}
                            />

                            <label
                                htmlFor="file"
                                className="px-5 flex items-center bg-c-secondary-800"
                            >
                                <Attachment
                                    className="fill-current text-main-green cursor-pointer"
                                    width={20}
                                    height={20}
                                />
                            </label>
                            <input
                                ref={register}
                                name="attachment"
                                type="file"
                                id="file"
                                hidden
                                onChange={handleUploadChange}
                            />
                            <button
                                className={`py-1 self-center hover:opacity-75 outline-none text-sm px-4 rounded-lg  ${
                                    text !== '' ? 'bg-main-green' : 'bg-muted'
                                } mx-2 w-3/12 h-10 flex justify-center text-center items-center focus:outline-none`}
                            >
                                {isLoading && <LoadingSpin w={20} />}
                                {t('common:send')}
                            </button>
                        </form>
                        <div className="grid grid-cols-4">
                            {files &&
                                files?.map((f) => (
                                    <img
                                        src={f}
                                        width={180}
                                        height={60}
                                        className="rounded-xl w-48 h-28 object-cover my-1"
                                        alt=""
                                    />
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default MessageCard;

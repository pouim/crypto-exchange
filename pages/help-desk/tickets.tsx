import { useQuery } from 'react-query';
import { Button, CheckBox } from '@components/ui';
import gate from '@gate/index';
import { useState } from 'react';
import Moment from 'react-moment';
import useTranslation from 'next-translate/useTranslation';

const Tickets = ({ back, setTickets, ticketId, handleShowMessage, ticketData }) => {
    const { data } = useQuery('tickets', gate.tickets);
    const closedTickets = ticketData?.filter((f: any) => f?.complete == true);
    const [isShowClosedTicket, setIsShowClosedTicket] = useState(false);
    const { t } = useTranslation();

    return (
        <section className="h-screen relative flex-col items-center justify-between flex w-full lg:w-4/12 bg-main">
            <div className="overflow-x-hidden left-3 right-3 overscroll-y-auto h-screen absolute hide-scrollbar transition py-5 flex flex-col justify-between">
                <div className="left-0 right-0">
                    {/* <div className="flex items-center my-3">
                        <CheckBox onChange={() => setIsShowClosedTicket(!isShowClosedTicket)} />
                        <span className="text-xs">Show closed ticket</span>
                    </div> */}
                    {isShowClosedTicket == false &&
                        data?.map((ticket) => (
                            <div
                                className={`${
                                    ticketId == ticket.id && 'border border-gray-200'
                                } rounded-lg bg-lighten-5 p-4 text-sm my-3 cursor-pointer`}
                                onClick={() => {
                                    setTickets(ticket.id);
                                    handleShowMessage();
                                }}
                            >
                                <div className="flex">
                                    <span className="text-main-green">
                                        {t('common:ID')}: {ticket.id} |{' '}
                                    </span>{' '}
                                    <span className="mx-2">{ticket.subject}</span>
                                </div>
                                <p className="text-gray-400 font-medium my-3">{ticket.describe}</p>
                                <div className="flex justify-between items-center">
                                    <button className="py-2 px-4 rounded-lg bg-muted my-2">
                                        {!!ticket.complete
                                            ? t('common:complete')
                                            : t('common:pending')}
                                    </button>
                                    <small className="text-gray-400">
                                        <Moment date={ticket.created_at} fromNow />
                                    </small>
                                </div>
                            </div>
                        ))}
                    {!!isShowClosedTicket &&
                        closedTickets?.map((ticket) => (
                            <div
                                className={`${
                                    ticketId == ticket.id && 'border border-gray-200'
                                } rounded-lg bg-lighten-5 p-4 text-sm my-3 cursor-pointer`}
                                onClick={() => {
                                    setTickets(ticket.id);
                                    handleShowMessage();
                                }}
                            >
                                <div className="flex">
                                    <span className="text-main-green">
                                        {t('common:ID')}: {ticket.id} |{' '}
                                    </span>{' '}
                                    <span className="mx-2">{ticket.subject}</span>
                                </div>
                                <p className="text-gray-400 font-medium my-3">{ticket.describe}</p>
                                <div className="flex justify-between items-center">
                                    <button className="py-2 px-4 rounded-lg bg-muted my-2">
                                        {!!ticket.complete
                                            ? t('common:complete')
                                            : t('common:pending')}
                                    </button>
                                    <small className="text-gray-400">
                                        <Moment date={ticket.created_at} fromNow />
                                    </small>
                                </div>
                            </div>
                        ))}
                </div>
                <div className="bottom-0 sticky shadow-sm">
                    <Button onClick={() => back()}>{t('common:create-ticket')}</Button>
                </div>
            </div>
        </section>
    );
};

export default Tickets;

import { useEffect, useState } from 'react';
import { getLayout } from '@components/common/Layout';

import Tickets from './tickets';
import CreateTicket from './createTicket';
import MessageCard from './MessageCard';
import withAuth from 'src/helpers/withAuth';
import { useWindowDimensions } from 'hooks/hooks';
import useTranslation from 'next-translate/useTranslation';
import { useQuery } from 'react-query';
import gate from '@gate/index';

const HelpDesk = () => {
    const [page, setPage] = useState('tickets');
    const [ticket, setTicket] = useState('');
    const { height, width } = useWindowDimensions();
    const [isShowMessage, setIsShowMessage] = useState(width !== null && width > 1024);
    const { t } = useTranslation();
    const { data } = useQuery('tickets', gate.tickets);

    useEffect(() => {
        if (width !== null && width >= 1024) {
            setIsShowMessage(true);
        } else {
            setIsShowMessage(false);
        }
    }, [width]);

    const handleShowMessage = () => {
        setIsShowMessage(!isShowMessage);
    };

    return (
        <div className="lg:flex transition-all">
            {width !== null && width >= 1024 ? (
                <>
                    {page == 'tickets' ? (
                        <Tickets
                            handleShowMessage={handleShowMessage}
                            back={() => setPage('create')}
                            setTickets={(t) => setTicket(t)}
                            ticketId={ticket}
                            ticketData={data}
                        />
                    ) : (
                        <CreateTicket back={() => setPage('tickets')} />
                    )}
                    {ticket !== '' && (
                        <MessageCard
                            handleShowMessage={handleShowMessage}
                            showBackBtn={false}
                            ticketNumber={ticket}
                        />
                    )}
                </>
            ) : (
                <>
                    {isShowMessage == false && page == 'tickets' ? (
                        <Tickets
                            handleShowMessage={handleShowMessage}
                            back={() => setPage('create')}
                            setTickets={(t) => setTicket(t)}
                            ticketId={ticket}
                            ticketData={data}
                        />
                    ) : (
                        isShowMessage == false && <CreateTicket back={() => setPage('tickets')} />
                    )}
                    {isShowMessage == true && (
                        <MessageCard
                            handleShowMessage={handleShowMessage}
                            showBackBtn={true}
                            ticketNumber={ticket}
                        />
                    )}
                </>
            )}
        </div>
    );
};

const _getLayout = (page) => getLayout(page, 'Helpdesk | TalanExchange', true, true);

export default withAuth(HelpDesk, _getLayout);

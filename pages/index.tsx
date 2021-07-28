import { getLayout } from '@components/common/Layout';
import withAuth from 'src/helpers/withAuth';
import Dashboard from './dashboard';

const Home = () => {
    return (
        <div dir="ltr" className="min-h-screen text-center text-white bg-c-secondary-800 ">
            <Dashboard />
        </div>
    );
};

const _getLayout = (page) => getLayout(page, 'Dashboard | TalanExchange', true);

export default withAuth(Home, _getLayout);

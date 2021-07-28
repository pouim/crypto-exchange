import { getLayout } from '@components/common/Layout';
import React, { FC } from 'react';
import withAuth from 'src/helpers/withAuth';
const Home = () => {
    return <div>home page</div>;
};

Home.getLayout = (page) => {
    const pageComponent = withAuth(page);
    return getLayout(pageComponent, 'Wallet', true);
};

export default Home;

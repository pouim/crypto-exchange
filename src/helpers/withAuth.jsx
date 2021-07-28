import React from 'react';
import nextCookie from 'next-cookies';

const withAuth = (Component, getLayout) => {
    const AuthComponent = (props) => {
        return <Component {...props} />;
    };

    AuthComponent.getInitialProps = async (ctx) => {
        const { token } = nextCookie(ctx);
        if (!token) {
            const redirect = '/auth';
            const { res } = ctx;

            if (res) {
                console.log(res);
                res.writeHead(302, {
                    Location: redirect,
                });
                res.end();
            } else {
                window.location.replace(redirect);
            }
        }

        let props = {};
        if (typeof Component.getInitialProps === 'function') {
            props = { ...Component.getInitialProps(ctx), ...props };
        }

        return props;
    };
    if (getLayout) {
        AuthComponent.getLayout = getLayout;
    }
    return AuthComponent;
};
export default withAuth;

const withReactSvg = require('next-react-svg');
const nextTranslate = require('next-translate');
const path = require('path');

module.exports = withReactSvg({
    include: path.resolve(__dirname, 'assets/svg'),
    webpack(config, { isServer }) {
        if (!isServer) {
            config.node = {
                fs: 'empty',
            };
        }
        return config;
    },
    env: {
        API_BASE_URL: 'http://185.110.189.66/api/',
        WS_BASE_URL: 'ws://185.110.189.66/api/ws',
        SOCKET_URL : 'http://130.185.77.49:10000',
    },
    ...nextTranslate({}),
});
// url /payment/deposit/ be /payment/deposits/ taghir kard
// alan get /payment/deposits/ history deposits ha va /payment/withdraws/ ham history withdraw ha ro neshon mide
// coin ham ok shod

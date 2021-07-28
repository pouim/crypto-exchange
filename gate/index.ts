import { RegisterRequest,ForgetPassRequest,ForgetPass,LoginRequest, UpdateUserInfo, SpodPlace, GetOrdersRequest, ResTradeHistory, reqDeposit, reqWithdraw, reqCreateTicket, resTickets, reqSendMessage, reqHistory, reqOtcChart,reqNotif,reqQuote, OTP, UpdateUserNumber } from 'interfaces';
import api from './api';
import Cookies from 'js-cookie';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import { method } from 'lodash';

const uploadFile = {
    uploadFile: (data: FormData, onUploadProgress: ((progressEvent: any) => void) | undefined) =>
        api.file('/file-upload', data, onUploadProgress),
};


const auth = {
    signIn: (data:LoginRequest) => api.post("auth/login/?name=login", data),
    logOut: (data) => api.post("/auth/logout/?name=logout"),
    signUp: (data: RegisterRequest) => api.post("auth/request-register/?name=request-register", data),
    signUpComplete: (data: OTP) =>  api.post("auth/register/?name=register", data),
    reqResetPassword: (data: ForgetPassRequest) => api.post("auth/request-reset-password/?name=request-reset-password", data),
    resetPassword: (data:ForgetPass) => api.post("auth/reset-password/?name=reset-password", data),
}
const user = {
    userInfo: () => api.get(`user/?name=user`),
    userDoc: () => api.get(`/user/documents/?name=user-detail`),
    updateUserInfo: (data: UpdateUserInfo) => api.put(`user/?name=user`, data),
    updateUserNumberReq: (data: UpdateUserNumber) =>
        api.post(`user/update-phone-request/`, data),
    updateUserNumberComplete: (data: OTP) =>
        api.post(`user/update-phone/`, data),
    sendDoc: (data: any) => api.file(`/user/documents/?name=user-detaill`, data, 'post'),
    deleteDoc: (id: string) => api.delete(`/user/documents/${id}/?name=user-detail`),
    replaceDoc: ({ id, data }) => api.patch(`/user/documents/${id}/?name=user-detail`, data),
};
const dashboard = {
    getOpenOrders: (data:GetOrdersRequest) => api.get(`/spot/orders/?name=order-list&open=true${data.status !== undefined ? `&status=${data?.status}`: ''}${data.created_at_after !== undefined ? `&created_at_after=${data?.created_at_after}`: ''}${data.created_at_before !== undefined ? `&created_at_before=${data?.created_at_before}`: ''}`),
    spotPlace: (data:SpodPlace) => api.post(`/spot/place/?name=spot`,data),
    getOrders: (data:GetOrdersRequest) => api.get(`/spot/orders/?name=order-list&offset=0&limit=10&${data.status !== undefined ? `&status=${data?.status}`: ''}${data.created_at_after !== undefined ? `&created_at_after=${data?.created_at_after}`: ''}${data.created_at_before !== undefined ? `&created_at_before=${data?.created_at_before}`: ''}${data.open !== undefined ? `&open=${data?.open}`: ''}`),
    cancelOrder: (id) => api.post(`/spot/cancel/?name=spot-cancel`,id),
    cancelSpod: ({id}) => api.post(`/spot/cancel/?name=spot-cancel`,id),
    paginateApi: ({url}) => api.get(url),
}

const wallet = {
    getWallet: () => api.get(`/wallet/wallet/?name=wallet-list`)
}

const coins = {
    getCoins: () => api.get(`/coins/?name=coins-list`)
}

const home = {
    home: () => api.get('/home'),
};

const trade = {
    tradeHistory: (symbol: string) =>
        api.get<ResTradeHistory[]>(`/trade/${symbol}/history/?name=history-list`),
    getSymbolOrders: (symbol: string) => api.get(`/trade/${symbol}/orders/?name=order-list`),
    getSpotFees: (data: any) =>
        api.get(`/spot/fees/?base_coin=${data.base_coin}&quote_coin=${data.quote_coin}`),
    getMarketWatch: () => api.get(`/marketwatch/?name=market-watch`)    
};

const payment = {
    deposit: (coin:reqDeposit) => api.post(`/payment/deposits/?name=deposit`,coin),
    deposits: () => api.get(`/payment/deposits/?name=withdraw`),
    reqWithdraw: (coin:reqWithdraw) => api.post(`payment/request-withdraw/?name=request-withdraw`,coin),
    withdraw: (data) => api.post(`/payment/withdraws/?name=withdraw`,data),
    withdraws: () => api.get(`/payment/withdraws/?name=withdraw`)
}
const otc = {
    getQuote: (coins:reqQuote) => api.post(`/otc/get-quote/?name=get-quote`,coins),
    finishQuote: (coins:reqQuote) => api.post(`/otc/orders/?name=otc-orders`,coins),
    otcOrders: () => api.get(`/otc/orders/?name=otc-orders`),
    otcToken: () => api.get(`/otc/get-agent-token/`),
    chart: (data:reqOtcChart) => api.post(`/otc/get-price-rates/`,data),
}


const tickets = {
    createTicket: (data:reqCreateTicket) => api.post(`tickets/?name=tickets-list`,data),
    tickets: () => api.get<resTickets[] | undefined>(`tickets/?name=tickets-list`),
    ticket: (id: number) => api.get(`/tickets/${id}/?name=tickets-detail`),
    messages: (ticketId) => api.get(`/messages/?ticket=${ticketId}&name=messages`),
    sendMessages: (data) => api.file(`/messages/?name=messages`,data,"post"),
    complateTicket: ({id,data}) => api.file(`/tickets/${id}/?name=tickets-detail`,data,"put"),
}
const notifications = {
    notifications: (data: reqNotif) => {
        console.log({data})
       return api.get(`/notifications/?limit=${data.limit}&name=user&offset=${data.offset}`)
    },
}

const accessToken = Cookies.get('token');
export const client = new W3CWebSocket(`${process.env.WS_BASE_URL}/?token=${accessToken}`);

export default {
    ...dashboard,
    ...uploadFile,
    ...home,
    ...auth,
    ...user,
    ...wallet,
    ...coins,
    ...trade,
    ...payment,
    ...tickets,
    ...notifications,
    ...otc
};

export interface LoginRequest {
    phone_number: string;
    password: string;
}
export interface CoinData {
        coin: {
        coint_type: string;
        created_at: string;
        icon: string | null;
        id: number;
        name: string;
        symbol: string;
    };
    total: number;
}
export interface RegisterRequest {
    phone_number: string,
    email?: string;
    first_name?: string;
    last_name?: string;
    country?: string;
    communication_lang?: string;
    password: string;

}

export interface OTP {
    code: string;
    phone_number: string;
}
export interface SpodPlace {
  "side": string,
  "coin": number,
  "to_coin": number,
  "price": number,
  "amount": number
}

export interface GetOrdersRequest {
    status?: string;
    created_at_after?: string | null;
    created_at_before?: string | null;
    created_at?: string;
    open?: 'Yes'|'No'
}

export interface Orders {
    amount: number,
    created_at: string,
    filled: string,
    quote_coin: {
    coint_type: string
    created_at: string
    icon: string
    id: number
    name: string
    symbol: string
    },
    base_coin: {
    coint_type: string
    created_at: string
    icon: string
    id: number
    name: string
    symbol: string
    },
    id: number,
    pair: string,
    price: 1,
    side: string,
    status: string,
    total: number,
    type: string,
    user: number
}

export interface ForgetPassRequest {
    phone_number: string,
}
export interface ForgetPass {
    code: string,
    new_password: string,
}
export interface UpdateUserInfo {
  phone_number?: string,
  email?: string,
  first_name?: string,
  last_name?: string,
  country?: string,
  communication_lang?: string
}

export interface UpdateUserNumber {
    phone_number?: string,
  }

export interface ResTradeHistory {
    price: number,
    amount: number,
    total: number,
    side: "SELL" | "BUY"
}
export interface ResTradeHistory {
    price: number,
    amount: number,
    total: number,
    side: "SELL" | "BUY"
}
export interface reqDeposit {
    coin:number
}
export interface reqQuote {
    base_coin:string
    quote_coin:string
    amount:number
}
export interface reqHistory {
    coin_one:string,
    coin_two:string
}
export interface reqOtcChart {
    "symbol": string,
    "from_date": number,
    "timeframe": number,
    "ticks": number
}
export interface reqWithdraw {
    amount: number | null,
    address: string,
    coin: number
}
export interface reqCreateTicket {
    describe: string;
    subject: string;
}
export interface reqCloseTicket {
    complete: any;
    id: string;
}
export interface reqGetMessage {
    id: number;
}
export interface reqNotif {
    limit?: number;
    offset?: number;
    pageParam?:any
}
export interface resTickets {
    complete: false;
    created_at: string;
    describe: string;
    id: number;
    subject: string;
    user: number;
}
export interface reqSendMessage {
    text: string
    attachment?: any
    ticket: number
}
export interface resWithdraws {
        id?: number,
        amount?: number,
        address?: string,
        status?: string,
        reason?: any,
        updated_at?: string,
        created_at?: string,
        user?: number,
        coin?: number
}

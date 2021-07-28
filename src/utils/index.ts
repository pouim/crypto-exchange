import Toastify from 'toastify-js';
import 'lodash.product';
import _ from 'lodash';

const removeEmpty = (obj: object): object => {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([_, v]) => v != '')
        .map(([k, v]) => [k, v === Object(v) ? removeEmpty(v) : v]),
    );
}


const showError = (data: any, config = { gravity: 'bottom', position: 'center', color: '#ff4154' }) => {
    if (data) {
        Object.keys(data).forEach((key) => {
            Toastify({
                text: data[key],
                duration: 3000,
                newWindow: true,
                close: true,
                gravity: config?.gravity, // `top` or `bottom`
                position: config?.position, // `left`, `center` or `right`
                backgroundColor: config?.color,
                stopOnFocus: true, // Prevents dismissing of toast on hover
            }).showToast();
        });
    }
    else return;
}

interface ToastConfig {
    gravity?: 'bottom' | 'top';
    position?: 'center' | 'left' | 'right';
    color?: string,
    close?: boolean,
    duration?:number
}

const toast = (text: string, config?: ToastConfig) => {
            Toastify({
                text: text,
                duration: config?.duration,
                newWindow: true,
                close: config?.close,
                gravity: config?.gravity, // `top` or `bottom`
                position: config?.position, // `left`, `center` or `right`
                backgroundColor: config?.color,
                stopOnFocus: true, // Prevents dismissing of toast on hover
            }).showToast();
}

const generateCoinSymbol = (coins) => {
    const coins_list = coins?.map((c) => c.coin.symbol);
    const l:any = _;
    let coins_data = l.product(coins_list, coins_list)
        .filter(([a, b]) => a !== b)
        .map((pair) => pair.join('-'));
    return coins_data;
}

const generateCoinSymbolOneWay = (coins) => {
    const coins_list = coins
        ?.filter((coin) => coin?.coin?.coint_type !== 'FIAT' && coin?.coin?.symbol !== 'USDT')
        ?.map((c) => c.coin.symbol);
    const fiat_list = coins
        ?.filter((coin) => coin.coin.coint_type === 'FIAT')
        ?.map((c) => c.coin.symbol);
    const updated_fiat_list = fiat_list && ['USDT', ...fiat_list]   
    const l: any = _;
    let coins_data = l
        .product(coins_list, updated_fiat_list)
        .filter(([a, b]) => a !== b)
        .map((pair) => pair.join('-'));
    return coins_data;
};

function remove_duplicate_obj(arr, prop) {
        var seen:any = {},
            order:any = [];
        arr.forEach(function (o) {
            var id = o[prop];
            if (id in seen) {
                // keep running sum of stocklevel
                var stocklevel = seen[id].stocklevel + o.stocklevel;
                // keep this newest record's values
                seen[id] = o;
                // upid[118805291], stocklevel=432, instock=truedate stocklevel to our running total
                seen[id].stocklevel = stocklevel;
                // keep track of ordering, having seen again, push to end
                order.push(order.splice(order.indexOf(id), 1));
            } else {
                seen[id] = o;
                order.push(id);
            }
        });

        return order.map(function (k) {
            return seen[k];
        });
    }

   export {removeEmpty ,showError,toast,generateCoinSymbol, generateCoinSymbolOneWay, remove_duplicate_obj}
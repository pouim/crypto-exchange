import axios from 'axios';
import Cookies from 'js-cookie';
// Make requests to CryptoCompare API
export async function makeApiRequest(path, url = 'https://min-api.cryptocompare.com') {
    try {
        const response = await fetch(`${url}/${path}`);
        return response.json();
    } catch (error) {
        console.log(`CryptoCompare request error: ${error.status}`);
        throw new Error(`CryptoCompare request error: ${error.status}`);
    }
}

const access_token = Cookies.get('token');

export async function makeApiRequestForChart(body) {
    try {
        const response = await axios.post('http://157.175.55.250:8000/otc/get-price-rates/', body, {
            headers: {
                'Authorization': `token ${access_token}`,
            },
        });
        return response;
    } catch (error) {
        console.log(`CryptoCompare request error: ${error.status}`);
        throw new Error(`CryptoCompare request error: ${error.status}`);
    }
}

// Generate a symbol ID from a pair of the coins
export function generateSymbol(exchange, fromSymbol, toSymbol) {
    const short = `${fromSymbol}/${toSymbol}`;
    return {
        short,
        full: `${exchange}:${short}`,
    };
}

export function parseFullSymbol(fullSymbol) {
    const match = fullSymbol.match(/^(\w+):(\w+)\/(\w+)$/);
    if (!match) {
        return null;
    }

    return {
        exchange: match[1],
        fromSymbol: match[2],
        toSymbol: match[3],
    };
}

export const handleSaveToPC = (jsonData, filename) => {
    const fileData = JSON.stringify(jsonData);
    const blob = new Blob([fileData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.json`;
    link.href = url;
    link.click();
};

import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from 'react-query';
import gate from '@gate/index';

import { setMeData, setToken } from '@store/reducers/user';
import { useDispatch } from 'react-redux';
import { queryClient } from 'pages/_app';
import { showError } from 'src/utils';
import { useEffect, useState } from 'react';
import { setAuthPage } from '@store/reducers/appearance';

const useSignIn = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    return useMutation(gate.signIn, {
        onSuccess: (data: any) => {
            dispatch(setMeData(data));
            dispatch(setToken(data.token));
            console.log(data.token);
            queryClient.setQueryData('sign-in-data', data);
            Cookies.set('token', data.token);
            localStorage.setItem('token', data.token);
            router.push('/');
        },
        onError: (data: any) => {
            showError(data.data, { color: 'red', gravity: 'bottom', position: 'left' });
        },
    });
};

const useSignUp = () => {
    const dispatch = useDispatch();

    return useMutation(gate.signUp, {
        onSuccess: (data: any): void => {
            // queryClient.setQueryData('sign-up-data', data);
            // console.log(queryClient.getQueryData('sign-up-data'));
            // localStorage.setItem('token', data.token);
            console.log('sucess', data);
            dispatch(setAuthPage('otp'));
        },
        onError: (data: any) => {
            showError(data.data, { color: 'red', gravity: 'center', position: 'top' });
        },
    });
};

const useSignUpComplete = () => {
    const dispatch = useDispatch();
    return useMutation(gate.signUpComplete, {
        onSuccess: (data: any): void => {
            queryClient.setQueryData('sign-up-data', data);
            console.log(queryClient.getQueryData('sign-up-data'));
            localStorage.setItem('token', data.token);
        },
        onError: (data: any) => {
            showError(data.data, { color: 'red', gravity: 'center', position: 'top' });
        },
    });
};

const useReqForgetPass = () => {
    return useMutation(gate.reqResetPassword);
};
const useGetOrders = () => {
    return useMutation(gate.getOrders);
};

const useGetFees = () => {
    return useMutation(gate.getSpotFees);
};
const useDis = () => {
    return useDispatch();
};

const useForgetPass = () => {
    return useMutation(gate.resetPassword);
};

const useUpdateUserInfo = () => {
    return useMutation(gate.updateUserInfo);
};

const useUpdateUserNumberReq = () => {
    return useMutation(gate.updateUserNumberReq);
};
const useUpdateUserNumberComplete = () => {
    return useMutation(gate.updateUserNumberComplete);
};

const useSendDoc = () => {
    return useMutation(gate.sendDoc);
};
const useReplaceDoc = () => {
    return useMutation(gate.replaceDoc);
};

const useDeleteDoc = () => {
    return useMutation(gate.deleteDoc);
};
const useSpodOrder = () => {
    return useMutation(gate.spotPlace);
};

const useGetUserWallet = () => {
    return useQuery('user-wallet', gate.getWallet, { retry: 1, refetchOnWindowFocus: false });
};

const useGetUser = () => {
    return useQuery('user-info', gate.userInfo, { retry: 1 });
};

const useGetCoins = () => {
    return useQuery('coins', gate.getCoins, { retry: 1 });
};

const useGetUserDoc = () => {
    return useQuery('user-doc', gate.userDoc, { retry: 1 });
};

const useGetMarketWatch = () => {
    return useQuery('market-watch', gate.getMarketWatch, { retry: 1 });
};

const useWindowDimensions = () => {
    const hasWindow = typeof window !== 'undefined';

    function getWindowDimensions() {
        const width = hasWindow ? window.innerWidth : null;
        const height = hasWindow ? window.innerHeight : null;
        return {
            width,
            height,
        };
    }

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        if (hasWindow) {
            function handleResize() {
                setWindowDimensions(getWindowDimensions());
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [hasWindow]);

    return windowDimensions;
};

export {
    useSignIn,
    useSignUpComplete,
    useUpdateUserInfo,
    useUpdateUserNumberReq,
    useUpdateUserNumberComplete,
    useGetUserWallet,
    useGetUserDoc,
    useGetUser,
    useSignUp,
    useForgetPass,
    useSendDoc,
    useDeleteDoc,
    useReplaceDoc,
    useReqForgetPass,
    useWindowDimensions,
    useGetCoins,
    useSpodOrder,
    useGetOrders,
    useDis,
    useGetFees,
    useGetMarketWatch,
};

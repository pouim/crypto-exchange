import { createAction } from '@reduxjs/toolkit';

export const login = createAction('USER_LOGIN');
export const layout = createAction('LAYOUT');
export const setSymbolAction = createAction('SET_SYMBOL');
export const logOut = createAction('USER_LOGOUT');

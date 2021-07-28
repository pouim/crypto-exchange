import { combineReducers } from 'redux';
import user from './user';
import appearanceReducer from './appearance';
import tradeReducer from './trade';

const rootReducers = combineReducers({
    user,
    appearance: appearanceReducer,
    trade: tradeReducer,

});

export default rootReducers;

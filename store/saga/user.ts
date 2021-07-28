import { all, delay, put, takeLatest, call, select, takeEvery } from "redux-saga/effects";
import { logOutUser, setMeData } from "../reducers/user";
import Cookies from 'js-cookie';
import { logOut } from "@store/actions";

function* setData(action: any) {
  return action;
}


function* logOutSaga({}) {
  try {
    yield put({type: logOutUser.type});
    Cookies.remove('token');
    yield delay(3000);
    window.location.replace('/auth');
  } catch (error) {
    console.log(error);
  }
}

export default function* root() {
  yield all([
  takeLatest(setMeData.type, setData),
  takeLatest(logOut.type, logOutSaga),
  ])
}

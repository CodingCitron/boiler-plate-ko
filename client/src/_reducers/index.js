import { combineReducers } from "redux";
import user from './user_reducer';
// import comment from './commnt_reducer';

const rootReducer = combineReducers({
    user
})

export default rootReducer;

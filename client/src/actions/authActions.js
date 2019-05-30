import {TEST_DISPATCH } from './types';


//Register Here

export const registerUser = userData => {
    return{
        type: TEST_DISPATCH,
        payload: userData
    };
};
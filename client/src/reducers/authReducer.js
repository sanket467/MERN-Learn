
const initialState = {
    isAuthenticated: false,
    user: {},
    test:'hello'
};

export default function(state = initialState, action){
    switch(action.type){
        default:
            return state;
    }
}
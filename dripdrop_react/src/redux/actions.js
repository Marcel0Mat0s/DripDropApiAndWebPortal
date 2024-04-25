export const SET_TOKEN = 'SET_TOKEN';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';

// Action creators to set token
export const setToken = (token) => ({
    type: SET_TOKEN,
    payload: token,
});

// Action creators to remove token
export const removeToken = () => ({
    type: REMOVE_TOKEN,
});
export const SET_TOKEN = 'SET_TOKEN';
export const REMOVE_TOKEN = 'REMOVE_TOKEN';
export const SET_USER_ID = 'SET_USER_ID';
export const REMOVE_USER_ID = 'REMOVE_USER_ID';
export const SET_ROLE = 'SET_ROLE';
export const REMOVE_ROLE = 'REMOVE_ROLE';

// Action creators to set token
export const setToken = (token) => ({
    type: SET_TOKEN,
    payload: token,
});

// Action creators to remove token
export const removeToken = () => ({
    type: REMOVE_TOKEN,
});

// Action creators to set User id
export const setUserId = (id) => ({
    type: SET_USER_ID,
    payload: id,
});

// Action creators to remove User id
export const removeUserId = () => ({
    type: REMOVE_USER_ID,
});

// Action creators to set role
export const setRole = (role) => ({
    type: SET_ROLE,
    payload: role,
});

// Action creators to remove role
export const removeRole = () => ({
    type: REMOVE_ROLE,
});

import { SET_TOKEN, REMOVE_TOKEN } from './actions';

// Initial state of the auth reducer
const initialState = {
    token: localStorage.getItem('token') || '',
};

// Auth reducer to set and remove token
const authReducer = (state = initialState, action) => {
    switch (action.type) {

    // Set token to the state
    case SET_TOKEN:
        return {
            ...state,
            token: action.payload,
        };

    // Remove token from the state
    case REMOVE_TOKEN:
        return {
            ...state,
            token: '',
        };
    default:

        // Return the state
        return state;
    }
};

// Export the auth reducer
export default authReducer;

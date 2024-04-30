import { SET_TOKEN, REMOVE_TOKEN, SET_USER_ID, REMOVE_USER_ID } from './actions';


// Initial state of the auth reducer
const initialState = {
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || '',
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

    // Set the User ID to the state
    case SET_USER_ID:
        return {
            ...state,
            userId: action.payload,
        };

    // Remove the User ID from the state
    case REMOVE_USER_ID:
        return {
            ...state,
            userId: '',
        };
        
    default:

        // Return the state
        return state;
    }
};

// Export the auth reducer
export default authReducer;

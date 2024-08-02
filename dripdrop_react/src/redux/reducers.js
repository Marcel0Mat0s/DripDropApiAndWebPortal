import { SET_TOKEN, REMOVE_TOKEN, SET_USER_ID, REMOVE_USER_ID, SET_ROLE, REMOVE_ROLE } from './actions';


// Initial state of the auth reducer
const initialState = {
    token: localStorage.getItem('token') || '',
    userId: localStorage.getItem('userId') || '',
    role: localStorage.getItem('role') || '',
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

    // Set the role to the state
    case SET_ROLE:
        return {
            ...state,
            role: action.payload,
        };

    // Remove the role from the state
    case REMOVE_ROLE:
        return {
            ...state,
            role: '',
        };
        
    default:

        // Return the state
        return state;
    }
};

// Export the auth reducer
export default authReducer;

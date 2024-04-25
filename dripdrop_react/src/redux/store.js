import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers';

// Create a store with the auth reducer
const store = configureStore({
    reducer: {
        auth: authReducer
    }
});

export default store;

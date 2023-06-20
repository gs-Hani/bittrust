import { configureStore } from '@reduxjs/toolkit';

import authReducer         from '../features/auth/authSlice';
import transRecordsReducer from '../features/transRecords/transRecordsSlice';
import profileReducer      from '../features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth        : authReducer,
    transRecords: transRecordsReducer,
    profile     : profileReducer,
  },
});

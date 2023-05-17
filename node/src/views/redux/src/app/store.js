import { configureStore } from '@reduxjs/toolkit';

import authReducer         from '../features/auth/authSlice';
import transRecordsReducer from '../features/transRecords/transRecordsSlice'

export const store = configureStore({
  reducer: {
    auth        : authReducer,
    transRecords: transRecordsReducer
  },
});

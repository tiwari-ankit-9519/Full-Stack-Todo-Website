import authReducer from "@/features/authSlice";
import todosReducer from "@/features/todosSlice";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    auth: authReducer,
    todos: todosReducer,
  },
});

export default store;

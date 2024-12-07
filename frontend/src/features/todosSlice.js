import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  todos: [],
  error: null,
  loading: false,
};

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:4000/api/todos/all");
      return response.data.todos;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const createTodo = createAsyncThunk(
  "todos/createTodo",
  async (todoData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/todos/create",
        todoData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data.todo;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ id, todoData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/todos/update/${id}`,
        todoData
      );
      return response.data.todo;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const completeTodo = createAsyncThunk(
  "todos/completeTodo",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:4000/api/todos/complete/${id}`
      );
      return response.data.todo;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:4000/api/todos/delete/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem("token");
      state.todos = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.todos = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(createTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createTodo.fulfilled, (state, action) => {
      state.todos.push(action.payload);
      state.loading = false;
      state.error = null;
    });
    builder.addCase(createTodo.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(updateTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateTodo.fulfilled, (state, action) => {
      const index = state.todos.findIndex(
        (todo) => todo.id === action.payload.id
      );
      state.todos[index] = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(updateTodo.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(completeTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(completeTodo.fulfilled, (state, action) => {
      const index = state.todos.findIndex(
        (todo) => todo.id === action.payload.id
      );
      state.todos[index] = action.payload;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(completeTodo.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
    builder.addCase(deleteTodo.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteTodo.fulfilled, (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      state.loading = false;
      state.error = null;
    });
    builder.addCase(deleteTodo.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });
  },
});

const todosReducer = todosSlice.reducer;

export default todosReducer;

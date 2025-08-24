import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
  backup: [],
};

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, { payload }) => {
      state.todos.push(payload);
      state.backup = [...state.todos];
    },
    removeTodo: (state, { payload }) => {
      state.todos = state.todos.filter((todo) => todo.id !== payload);
      state.backup = [...state.todos];
    },
    editTodo: (state, { payload }) => {
      state.todos = state.todos.map((todo) =>
        todo.id === payload.id
          ? { ...todo, title: payload.title, completed: payload.completed }
          : todo
      );
      state.backup = [...state.todos];
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter((todo) => !todo.completed);
      state.backup = [...state.todos];
    },

    filter: (state, { payload }) => {
      if (payload === "all") {
        state.todos = state.backup;
      } else if (payload === "completed") {
        state.todos = state.backup.filter((item) => item.completed);
      } else if (payload === "active") {
        state.todos = state.backup.filter((item) => !item.completed);
      }
    },
    reorder: (state, { payload }) => {
      state.todos = payload;
      state.backup = [...payload];
    },
  },
});

export const { addTodo, removeTodo, editTodo, filter, reorder, clearCompleted } =
  todosSlice.actions;
export default todosSlice.reducer;
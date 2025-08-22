import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTodo, editTodo, removeTodo } from "./app/features/todoSlice";
import "./app.css";


function App() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);

  const todos = useSelector((state) => state.todos.todos);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim()) {
      if (id) {
        dispatch(
          editTodo({
            id,
            title: title.trim(),
            completed,
          })
        );
        setId("");
      } else {
        dispatch(
          addTodo({
            id: Math.random(),
            title: title.trim(),
            completed,
          })
        );
      }

      setTitle("");
      setCompleted(false);
    }
  };

  const handleEdit = (todo) => {
    setTitle(todo.title);
    setCompleted(todo.completed);
    setId(todo.id);
  };

  // const handleDelete = (id) => {
  //   dispatch(removeTodo(id));
  // };

  return (
    <div>
      <h1 className="crud">Todo List Crud</h1>
      <form className="todo-form" onSubmit={handleSubmit}>
        <input className="title-inp"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        <label className="completed">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          Completed
        </label>

        <button className="submit-btn" type="submit">{id ? "Update" : "Add"} Todo</button>
      </form>
      <div>
        <ul className="todo-list">
          {todos &&
            todos.map((todo) => {
              return (
                <li className="todo-item" key={todo.id}>
                  <h4 className="todo-title" style={{ opacity: todo.completed ? "0.5" : "1" }}>
                    {todo.title}
                    <button className="todo-delete" onClick={() => dispatch(removeTodo(todo.id))}>
                      Delete
                    </button>
                    <button className="todo-edit" onClick={() => handleEdit(todo)}>Edit Todo</button>
                  </h4>
                </li>
              );
            })}
        </ul>
      </div>{" "}
    </div>
  );
}

export default App;

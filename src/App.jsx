import React, { useState,  useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addTodo,
  editTodo,
  removeTodo,
  filter,
  reorder,
  clearCompleted,
} from "./app/features/todoSlice";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./app.css";
import { motion, AnimatePresence } from "framer-motion";

function App() {
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [completed, setCompleted] = useState(false);

  const todos = useSelector((state) => state.todos.todos);
  const itemsLeft = todos.filter((todo) => !todo.completed).length;
  const [theme, setTheme] = useState("light");
  const dispatch = useDispatch();

   useEffect(() => {
    document.body.className = theme;
  }, [theme]);

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
            id: Math.random().toString(36).substr(2, 9),
            title: title.trim(),
            completed,
          })
        );
      }

      setTitle("");
      setCompleted(false);
    }
  };

  // const handleEdit = (todo) => {
  //   setTitle(todo.title);
  //   setCompleted(todo.completed);
  //   setId(todo.id);
  // };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reordered = Array.from(todos);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);

    dispatch(reorder(reordered));
  };

  return (
    <div className={`container ${theme}`}>
      <h1 className="header">
        TODO
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <img
            src={theme === "light" ? "./images/moon.svg" : "./images/sun.svg"}
          />
        </button>
      </h1>
      <div className="create-inp">
        <label className="completed">
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
          />
          <span className="checkmark">
            <img src="./images/check.svg" alt="" />
          </span>
        </label>
        <input
          className="title-inp"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Create a new todo..."
        />
      </div>

      <form className="todo-form" onSubmit={handleSubmit}>
        <button className="submit-btn" type="submit">
          Add Todo
        </button>
      </form>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul
              className="todo-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <AnimatePresence className="todo-cards">
                {todos &&
                  todos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <motion.li
                          className="todo-item"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          layout
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                        >
                          <label className="completed">
                            <input
                              type="checkbox"
                              checked={completed}
                              onChange={(e) => setCompleted(e.target.checked)}
                            />
                            <span className="checkmark">
                              <img
                                src="./images/check.svg"
                                alt=""
                                className=""
                              />
                            </span>
                          </label>
                          <h4
                            className="todo-title"
                            style={{ opacity: todo.completed ? "0.5" : "1" }}
                          >
                            {todo.title}
                            <button
                              className="todo-delete"
                              onClick={() => dispatch(removeTodo(todo.id))}
                            >
                              <img src="./images/cross.svg" alt="" />
                            </button>
                            {/* <button
                                className="todo-edit"
                                onClick={() => handleEdit(todo)}
                              >
                                Edit Todo
                              </button> */}
                          </h4>
                        </motion.li>
                      )}
                    </Draggable>
                  ))}
              </AnimatePresence>
              {provided.placeholder}
              <div className="filters">
                <span className="items-left">{itemsLeft} items left</span>

                <button onClick={() => dispatch(filter("all"))}>All</button>
                <button onClick={() => dispatch(filter("completed"))}>
                  Completed
                </button>
                <button onClick={() => dispatch(filter("active"))}>
                  Active
                </button>
                <button onClick={() => dispatch(clearCompleted())}>
                  Clear Completed
                </button>
              </div>
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

export default App;

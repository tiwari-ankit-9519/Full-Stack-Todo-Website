/* eslint-disable react/prop-types */
import EditTodo from "./EditTodo";
import { Checkbox } from "./ui/checkbox";
import { useDispatch } from "react-redux";
import { completeTodo, fetchTodos } from "@/features/todosSlice";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import Modal from "./Modal";

function Todos({ todos }) {
  const dispatch = useDispatch();
  const [updatingTodoId, setUpdatingTodoId] = useState(null);

  const handleCompleteTodo = async (id) => {
    setUpdatingTodoId(id);
    try {
      await dispatch(completeTodo(id)).unwrap();
      dispatch(fetchTodos());
      enqueueSnackbar(
        todos.done ? "Todo marked as uncomplete" : "Todo marked as completed",
        { variant: "success", autoHideDuration: 1000 }
      );
    } catch {
      enqueueSnackbar("Failed to mark todo as completed", {
        variant: "error",
        autoHideDuration: 1000,
      });
    } finally {
      setUpdatingTodoId(null);
    }
  };

  return (
    <div className="flex items-center justify-between border-b border-zinc-400">
      <div>
        <h4
          className={`text-xl font-semibold ${
            todos.done ? "line-through" : ""
          }`}
        >
          {todos.title}
        </h4>
        <p className={`text-gray-500 `}>{todos.content}</p>
        <div className="flex gap-2 items-center mb-2">
          <p>
            {updatingTodoId === todos.id
              ? todos.done
                ? "Marking as uncomplete..."
                : "Marking as complete..."
              : todos.done
              ? "Marked as Completed"
              : "Mark as completed"}
          </p>
          <Checkbox
            checked={todos.done}
            onClick={() => handleCompleteTodo(todos.id)}
            disabled={updatingTodoId === todos.id}
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <EditTodo id={todos.id} />
        <Modal id={todos.id} />
        {/* <Button className="bg-red-600 p-4 hover:bg-red-700">
          <Trash2 />
          Delete
        </Button> */}
      </div>
    </div>
  );
}

export default Todos;

import Todos from "@/components/Todos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTodos, createTodo } from "@/features/todosSlice";
import { enqueueSnackbar } from "notistack";
import Loader from "@/components/Loader";
import { logoutUser } from "@/features/authSlice";

function Home() {
  const userStored = JSON.parse(localStorage.getItem("user"));
  const { name } = userStored;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [addingTodo, setAddingTodo] = useState(false);

  const dispatch = useDispatch();
  const { todos } = useSelector((state) => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setAddingTodo(true);

    dispatch(createTodo({ title, content }))
      .unwrap()
      .then(() => {
        enqueueSnackbar("Todo added successfully", { variant: "success" });
        dispatch(fetchTodos());
      })
      .catch(() => {
        enqueueSnackbar("Failed to add todo", { variant: "error" });
      })
      .finally(() => {
        setAddingTodo(false);
      });

    setTitle("");
    setContent("");
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    window.location.reload();
  };

  return (
    <main className="px-[5%] py-[3%] min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-6xl font-extrabold">
          Welcome 👋 {name.split(" ")[0]}
        </h1>
        {userStored && (
          <Button
            className="border border-red-500 bg-none hover:bg-red-500"
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
      </div>

      <div className="mt-20">
        <h3 className="text-3xl font-semibold">Add a todo</h3>
        <form onSubmit={handleSubmit} className="flex items-center gap-10">
          <div className="flex items-center w-full relative">
            <Input
              className="mt-10 p-6 "
              placeholder="Enter the title of todo"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="absolute right-5 top-[3.3rem]">
              <DeleteIcon
                className="cursor-pointer"
                onClick={() => setTitle("")}
              />
            </div>
          </div>
          <div className="flex w-full relative">
            <Input
              className="mt-10 p-6 "
              placeholder="Enter the content of todo"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="absolute right-5 top-[3.3rem]">
              <DeleteIcon
                className="cursor-pointer"
                onClick={() => setContent("")}
              />
            </div>
          </div>
          <Button
            className="mt-10 bg-green-600 p-6 hover:bg-green-700"
            disabled={addingTodo}
          >
            {addingTodo ? "Adding..." : "Add Todo"}
          </Button>
        </form>
      </div>

      <div>
        <h3 className="text-3xl font-semibold mt-20 mb-10">Your todos</h3>
        <div className="flex flex-col gap-5 mt-5">
          {todos.length > 0 ? (
            todos.map((todo) => (
              <Todos key={todo.id} todos={todo} id={todo.id} />
            ))
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </main>
  );
}

export default Home;

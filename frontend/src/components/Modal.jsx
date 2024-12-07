/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTodo } from "@/features/todosSlice";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

export default function Modal({ id }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.todos);
  const [open, setOpen] = useState(false);

  const handleDelete = (id) => {
    dispatch(deleteTodo(id))
      .unwrap()
      .then(() => {
        enqueueSnackbar("Todo deleted successfully", {
          variant: "success",
          autoHideDuration: 1000,
        });
        setOpen(false);
      })
      .catch(() => {
        enqueueSnackbar("Failed to delete todo", {
          variant: "error",
          autoHideDuration: 1000,
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-red-600 p-4 hover:bg-red-700"
          onClick={() => setOpen(true)}
        >
          <Trash2 />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button
            className="bg-red-500 hover:bg-red-700"
            onClick={() => handleDelete(id)}
          >
            {loading ? "Deleting..." : "Yes"}
          </Button>
          <Button onClick={() => setOpen(false)}>No</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

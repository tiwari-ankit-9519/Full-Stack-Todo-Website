/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pen } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateTodo } from "@/features/todosSlice";
import { enqueueSnackbar } from "notistack";

export default function EditTodo({ id }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.todos);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateTodo({ id, todoData: { title, content } }))
      .unwrap()
      .then(() => {
        enqueueSnackbar("Todo updated successfully", { variant: "success" });
        setTitle("");
        setContent("");
      })
      .catch(() => {
        enqueueSnackbar("Failed to update todo", { variant: "error" });
      });
    console.log("submitted");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="">
          <Pen />
          Edit Todo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-black">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Make changes to your todo here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Content
            </Label>
            <Input
              id="username"
              className="col-span-3"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import React, { useState } from "react";
import { FC } from "react";
import { TaskData } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/lib/config";

interface EditTaskProps {
  task: TaskData;
  setTask: React.Dispatch<React.SetStateAction<TaskData[]>>;
}

const EditTask: FC<EditTaskProps> = ({ task, setTask }) => {
  const [title, setTitle] = useState<string>(task.title);
  const [description, setDescription] = useState<string>(task.description);
  const [priority, setPriority] = useState<string>(task.priority);
  const [date, setDate] = useState<string>(task.date);
  const [loading, setLoading] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const handleModalEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setModal(!modal);
  };

  const editData = async () => {
    const taskToUpdate = doc(db, "tasks", task.id);

    await updateDoc(taskToUpdate, {
      title: title,
      description: description,
      priority: priority,
      date: date,
    });

    setTask((prevTasks) =>
      prevTasks.map((prevTask) => {
        if (prevTask.id === task.id) {
          return {
            ...prevTask,
            title: title,
            description: description,
            priority: priority,
            date: date,
          };
        }
        return prevTask;
      })
    );
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    editData();
    setLoading(false);
    setModal(false);
  };

  return (
    <div>
      <button className="btn btn-info btn-xs" onClick={handleModalEdit}>edit</button>
      <input
        type="checkbox"
        className="modal-toggle"
        onChange={handleModalEdit}
        checked={modal}
      />
      <div className="modal">
        <div className="modal-box">
          <form className="form">
            <label className="label">title</label>
            <input
              className="input input-bordered"
              type="text"
              placeholder="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <label className="label">Descrition</label>
            <input
              className="input input-bordered"
              type="text"
              placeholder="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <label className="label">Date</label>
            <input
              className="input input-bordered"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <label className="label">Priority</label>
            <select
              onChange={(e) => setPriority(e.target.value)}
              className="input"
              value={priority}
            >
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
            <div className="gap-5 flex justify-end">
              <button className="btn btn-neutral btn-sm" onClick={handleEdit}>
                Edit
              </button>
              <button
                className="btn btn-neutral btn-sm"
                onClick={handleModalEdit}
              >
                close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditTask;

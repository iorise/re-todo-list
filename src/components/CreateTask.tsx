"use client";

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/lib/config";
import React, { useState } from "react";
import type { TaskData } from "@/types/index";
import { FC } from "react";

interface CreateTaskProps {
  task: TaskData[];
  setTask: React.Dispatch<React.SetStateAction<TaskData[]>>;
}

const CreateTask: FC<CreateTaskProps> = ({ task, setTask }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("low");
  const [date, setDate] = useState<string>("");
  const [modal, setModal] = useState(false);

  const databaseRef = collection(db, "tasks");

  const data = {
    title: title,
    description: description,
    priority: priority,
    date: date,
  };

  const addData = async () => {
    await addDoc(databaseRef, data);
  };

  const handleModalAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setModal(!modal);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    addData();
    setModal(false);
    setLoading(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDate("");
    setPriority("low");
  };


  return (
    <div>
      <div>
        <button className="btn btn-primary" onClick={handleModalAdd}>
          add task
        </button>
        <input
          type="checkbox"
          checked={modal}
          onChange={handleModalAdd}
          className="modal-toggle"
        />
        <div className="modal">
          <div className="modal-box">
            <div className="add-form">
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
                  <button
                    className="btn btn-neutral btn-sm"
                    onClick={handleSubmit}
                  >
                    add
                  </button>
                  <button
                    className="btn btn-neutral btn-sm"
                    onClick={handleModalAdd}
                  >
                    close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;

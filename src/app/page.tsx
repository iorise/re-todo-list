"use client";

import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./lib/config";
import React, { useEffect, useState } from "react";
import type { TaskData } from "@/types/index";

const HomePage = () => {
  const [task, setTask] = useState<TaskData[]>([]);
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

  const getData = async () => {
    const querySnapshot = await getDocs(collection(db, "tasks"));
    const tasks: TaskData[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "",
        description: data.description || "",
        priority: data.priority || "",
        date: data.date || "",
      };
    });
    setTask(tasks);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const handleEdit = async (id: string) => {
    setLoading(true);
    const taskToUpdate = doc(db, "tasks", id);

    await updateDoc(taskToUpdate, data);

    setLoading(false);
    resetForm();
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

  // live update

  useEffect(() => {
    getData();

    const unsubscribe = onSnapshot(query(databaseRef), (snapshot) => {
      const tasks: TaskData[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          priority: data.priority || "",
          date: data.date || "",
        };
      });
      setTask(tasks);
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

      <div>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Priority</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            {task.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.description}</td>
                <td>{item.date}</td>
                <td>{item.priority}</td>
                <td className="gap-3 flex">
                  <button
                    className="btn btn-xs"
                    onClick={() => handleEdit(item.id)}
                  >
                    edit
                  </button>
                  <button
                    className="btn btn-error btn-xs"
                    onClick={() => handleDelete(item.id)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;

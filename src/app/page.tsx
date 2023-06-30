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
import EditTask from "@/components/EditTask";
import CreateTask from "@/components/CreateTask";

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
      <CreateTask task={task} setTask={setTask} />

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
                  <EditTask task={item} setTask={setTask} />
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

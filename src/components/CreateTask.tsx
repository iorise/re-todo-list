"use client";

import { collection, addDoc } from "firebase/firestore";
import { db } from "@/app/lib/config";
import React, { useState } from "react";
import type { TaskData } from "@/types/index";
import { FC } from "react";
import { AiOutlineWarning } from "react-icons/ai";
import { handleLogin, handleLoginGoogle } from "@/app/lib/auth";

interface CreateTaskProps {
  isLoggedIn: boolean;
}

const CreateTask: FC<CreateTaskProps> = ({ isLoggedIn }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [priority, setPriority] = useState<string>("low");
  const [date, setDate] = useState<string>("");
  const [modal, setModal] = useState(false);
  const [modalUser, setModalUser] = useState(false);

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

  const handleNotLogin = () => {
    setModalUser(!modalUser);
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <div className="w-full mt-20 text-center">
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
                      className="input input-bordered w-full"
                      type="text"
                      placeholder="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                    <label className="label">Descrition</label>
                    <input
                      className="input input-bordered w-full"
                      type="text"
                      placeholder="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                    <label className="label">Date</label>
                    <input
                      className="input input-bordered w-full"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                    <label className="label">Priority</label>
                    <select
                      onChange={(e) => setPriority(e.target.value)}
                      className="input w-full"
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
      ) : (
        <div className="w-full mt-20 text-center">
          <button className="btn btn-primary" onClick={handleNotLogin}>
            add task
          </button>
          <input
            type="checkbox"
            checked={modalUser}
            onChange={handleNotLogin}
            className="modal-toggle"
          />
          <div className="modal">
            <div className="modal-box w-[300px] ">
              <div className="text-center items-center flex flex-col">
                <AiOutlineWarning size={120} />
                <p className="text-xl pt-2">You Must Login!</p>
                <button
                  className="absolute right-2 top-0 text-xl"
                  onClick={handleNotLogin}
                >
                  X
                </button>
              </div>
            </div>
          </div>
          <div className="w-full flex items-center justify-center">

          <div className="mt-5 flex  items-center bg-[#516276]/50  md:max-w-[250px] w-full p-2 ml-3 rounded-lg h-[70px] max-w-[200px]">
            <div className="flex justify-center gap-8 w-full">
              <button className="btn" onClick={handleLogin}>
                Guest
              </button>
              <button className="btn" onClick={handleLoginGoogle}>
                Login
              </button>
            </div>
          </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateTask;

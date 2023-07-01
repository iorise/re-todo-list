"use client";

import {
  collection,
  getDocs,
  onSnapshot,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "./lib/config";
import React, { useEffect, useState } from "react";
import type { TaskData } from "@/types/index";
import {EditTask, CreateTask} from "@/components/index"
import { BsFillTrash2Fill } from "react-icons/bs";
import { FaSignOutAlt } from "react-icons/fa";
import { GrUserSettings } from "react-icons/gr";
import { onAuthStateChanged } from "firebase/auth";
import {
  handleLogout,
  setDisplayName,
  auth,
} from "./lib/auth";

const HomePage = () => {
  const [task, setTask] = useState<TaskData[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState<string>("");
  const [currentUserDisplayName, setCurrentUserDisplayName] =
    useState<string>("");
  const [modalDisplayName, setModalDisplayName] = useState(false);

  const databaseRef = collection(db, "tasks");


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

    const authUnsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(user !== null);
      setCurrentUserDisplayName(user?.displayName || "");
    });

    return () => {
      unsubscribe();
      authUnsubscribe();
    };
  }, []);

  const currentUser = auth.currentUser;

  const handleEditDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    await setDisplayName(editDisplayName);
    setCurrentUserDisplayName(editDisplayName);
    setModalDisplayName(false);
    setEditDisplayName("");
  };

  const handleModalDisplayName = (e: React.FormEvent) => {
    e.preventDefault()
    setModalDisplayName(!modalDisplayName);
    setEditDisplayName("");

  };

  const defaultProfilePictureUrl = "/renge.jpg";

  return (
    <div>
      {/* <div>
        {!isLoggedIn ? (
          <div className="flex items-center justify-between bg-[#516276]/50 max-w-[250px] w-full p-2 ml-3 rounded-lg h-[70px]">
            <div className="flex gap-3">
              <button onClick={handleLogin}>Guest</button>
              <button onClick={handleLoginGoogle}>Login</button>
            </div>
          </div>
        ) : (
          <button onClick={handleLogout}>
            <FaSignOutAlt />
          </button>
        )}
      </div> */}

      <CreateTask isLoggedIn={isLoggedIn} />
      
      {!isLoggedIn ? (
        <div className="w-full text-center pt-5 text-2xl">
          <p>No Task here</p>
        </div>
      ) : (
        <div>
          <div>
            <input
              type="checkbox"
              checked={modalDisplayName}
              onChange={handleModalDisplayName}
              className="modal-toggle"
            />
            <div className="modal">
              <div className="modal-box">
                <form action="">
                  <label htmlFor="editDisplayName">edit display name</label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={editDisplayName}
                    onChange={(e) => setEditDisplayName(e.target.value)}
                  />
                  <div className="flex gap-3 justify-end">
                    <button onClick={handleEditDisplayName}>set</button>
                    <button onClick={handleModalDisplayName}>close</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="mt-5 flex items-center justify-between bg-[#516276]/50 max-w-[250px] w-full p-2 ml-3 rounded-lg h-[70px]">
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="w-10 rounded-full">
                  <img
                    src={currentUser?.photoURL ?? defaultProfilePictureUrl}
                    alt="Profile Picture"
                  />
                </div>
              </div>
              <p className="text-xl text-white/80 font-bold tracking-widest overflow-hidden h-[30px] w-[110px]">
                {currentUserDisplayName}
              </p>
            </div>

            <div className="items-center flex gap-3">
              <button className="" onClick={handleLogout} title="Sign Out">
                <FaSignOutAlt size={20} />
              </button>
              <button className="" onClick={handleModalDisplayName}>
                <GrUserSettings size={20} />
              </button>
            </div>
          </div>
          <div className="pt-5">
            <table className="table">
              <div className="absolute w-full m-auto text-center items-center justify-center">

            {task.length === 0 && isLoggedIn && (
        <div className="w-full text-center pt-5 text-2xl">
          <p>No Task here</p>
        </div>
      )}
              </div>
              <thead>
                <tr className="text-white">
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
                    <td>
                      <div className="flex md:flex-col gap-3 ">
                        <EditTask task={item} setTask={setTask} />
                        <button
                          className="btn btn-error w-1/2 btn-xs"
                          onClick={() => handleDelete(item.id)}
                        >
                          <BsFillTrash2Fill />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

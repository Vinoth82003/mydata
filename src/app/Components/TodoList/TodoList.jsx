"use client";

import { useEffect, useState } from "react";
import styles from "./TodoList.module.css";
import {
  CheckCircle,
  Circle,
  Trash2,
  Plus,
  Pencil,
  Save,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function TodoList({ redirectToLogin }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [token, setToken] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) {
      redirectToLogin?.();
      return;
    }
    setToken(storedToken);
    fetchTasks(storedToken);
  }, []);

  const fetchTasks = async (token) => {
    try {
      const res = await fetch("/api/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) setTasks(data.data);
      else handleError(data.error);
    } catch {
      toast.error("Failed to load tasks");
    }
  };

  const addTask = async () => {
    if (!input.trim()) return toast.error("Task can't be empty");
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: input.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks([data.data, ...tasks]);
        setInput("");
        toast.success("Task added");
      } else handleError(data.error);
    } catch {
      toast.error("Server error");
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find((t) => t._id === id);
    try {
      const res = await fetch("/api/todos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          updates: { completed: !task.completed },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks((prev) => prev.map((t) => (t._id === id ? data.data : t)));
      } else handleError(data.error);
    } catch {
      toast.error("Server error");
    }
  };

  const deleteTask = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete this task?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });
    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/todos?id=${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setTasks((prev) => prev.filter((t) => t._id !== id));
        toast.success("Deleted");
      } else handleError(data.error);
    } catch {
      toast.error("Server error");
    }
  };

  const startEdit = (task) => {
    setEditId(task._id);
    setEditText(task.text);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return toast.error("Task cannot be empty");

    try {
      const res = await fetch("/api/todos", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, updates: { text: editText.trim() } }),
      });
      const data = await res.json();
      if (data.success) {
        setTasks((prev) =>
          prev.map((t) => (t._id === id ? { ...t, text: editText.trim() } : t))
        );
        cancelEdit();
        toast.success("Task updated");
      } else handleError(data.error);
    } catch {
      toast.error("Server error");
    }
  };

  const handleError = (error) => {
    if (error === "jwt expired" || error === "Unauthorized") {
      redirectToLogin?.();
      Swal.fire("Session Expired", "Please log in again", "error");
    } else {
      toast.error(error || "Something went wrong");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.heading}>Your To-Do List</h2>

      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Add new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addTask}>
          <Plus size={18} />
        </button>
      </div>

      <ul className={styles.taskList}>
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.li
              key={task._id}
              className={`${styles.taskItem} ${
                task.completed ? styles.completed : ""
              }`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
            >
              <button onClick={() => toggleTask(task._id)}>
                {task.completed ? (
                  <CheckCircle className={styles.checkIcon} />
                ) : (
                  <Circle className={styles.uncheckIcon} />
                )}
              </button>

              {editId === task._id ? (
                <>
                  <input
                    className={styles.editInput}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(task._id)}>
                    <Save size={16} />
                  </button>
                  <button onClick={cancelEdit}>
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <span>{task.text}</span>
                  <button onClick={() => startEdit(task)}>
                    <Pencil size={16} />
                  </button>
                </>
              )}

              <button
                className={styles.deleteBtn}
                onClick={() => deleteTask(task._id)}
              >
                <Trash2 size={16} />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}

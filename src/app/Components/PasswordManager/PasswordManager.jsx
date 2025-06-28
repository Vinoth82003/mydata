"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function PasswordManager() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    title: "",
    username: "",
    password: "",
    website: "",
  });

  const token = localStorage.getItem("accessToken");

  const fetchEntries = async () => {
    const res = await fetch("/api/password-manager", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setEntries(data.data);
    else toast.error(data.error);
  };

  const addEntry = async () => {
    const res = await fetch("/api/password-manager", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setForm({ title: "", username: "", password: "", website: "" });
      fetchEntries();
      toast.success("Password saved");
    } else toast.error(data.error);
  };

  const deleteEntry = async (id) => {
    const res = await fetch(`/api/password-manager?id=${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) {
      fetchEntries();
      toast.success("Deleted");
    } else toast.error(data.error);
  };

  useEffect(() => {
    if (token) fetchEntries();
  }, [token]);

  return (
    <div>
      <h2>Password Manager</h2>
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <input
        placeholder="Website"
        value={form.website}
        onChange={(e) => setForm({ ...form, website: e.target.value })}
      />
      <button onClick={addEntry}>Add</button>

      <ul>
        {entries.map((entry) => (
          <li key={entry._id}>
            <strong>{entry.title}</strong> — {entry.username} — {entry.password}
            <button onClick={() => deleteEntry(entry._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

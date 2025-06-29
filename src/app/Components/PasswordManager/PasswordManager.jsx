"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import styles from "./PasswordManager.module.css";
import {
  Lock,
  User2Icon,
  Eye,
  EyeOff,
  Copy,
  Pencil,
  Trash2,
  Star,
  StarOff,
} from "lucide-react";
import Swal from "sweetalert2";
import { format } from "timeago.js";

export default function PasswordManager({ redirectToLogin }) {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    title: "",
    username: "",
    password: "",
    website: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    username: "",
    password: "",
    website: "",
  });
  const [showPassword, setShowPassword] = useState({});
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [originalEditEntry, setOriginalEditEntry] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const token =
    typeof window !== "undefined" && localStorage.getItem("accessToken");

  const fetchEntries = async () => {
    const res = await fetch("/api/password-manager", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (data.success) setEntries(data.data);
    else {
      if (data.error == "jwt expired") {
        redirectToLogin();
        Swal.fire(
          "Error",
          "Login expired, Login again to access your account",
          "error"
        );
      } else {
        Swal.fire("Error", data.error, "error");
      }
    }
  };

  const addEntry = async () => {
    const { title, username, password } = form;

    if (!title || !username || !password) {
      return toast.error(
        "Please fill in all required fields: Title, Username, and Password."
      );
    }

    try {
      setLoading(true);

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
      } else {
        if (data.error == "jwt expired") {
          redirectToLogin();
          Swal.fire(
            "Error",
            "jwt expired, Login again to access your profile",
            "error"
          );
        } else {
          Swal.fire("Error", data.error, "error");
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const deleteEntry = async (id, title) => {
    const result = await Swal.fire({
      title: `Delete "${title}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/password-manager?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        fetchEntries();
        Swal.fire("Deleted!", "Your entry has been deleted.", "success");
      } else {
        if (data.error == "jwt expired") {
          redirectToLogin();
          Swal.fire(
            "Error",
            "jwt expired, Login again to access your profile",
            "error"
          );
        } else {
          Swal.fire("Error", data.error, "error");
        }
      }
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry._id);
    setEditForm({
      title: entry.title,
      username: entry.username,
      password: entry.password,
      website: entry.website,
    });
    setOriginalEditEntry({
      title: entry.title,
      username: entry.username,
      password: entry.password,
      website: entry.website,
    });
  };

  const updateEntry = async () => {
    if (!editForm.title || !editForm.username || !editForm.password) {
      return toast.error("Title, Username, and Password are required.");
    }

    if (JSON.stringify(editForm) === JSON.stringify(originalEditEntry)) {
      return toast.error("No changes to update.");
    }

    try {
      setEditLoading(true);

      const res = await fetch(`/api/password-manager`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: editingId,
          updates: editForm,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Updated successfully");
        setEditingId(null);
        setEditForm({ title: "", username: "", password: "", website: "" });
        setOriginalEditEntry(null);
        fetchEntries();
      } else {
        if (data.error == "jwt expired") {
          redirectToLogin();
          Swal.fire(
            "Error",
            "jwt expired, Login again to access your profile",
            "error"
          );
        } else {
          Swal.fire("Error", data.error, "error");
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  const toggleFavorite = async (id, currentFav) => {
    try {
      const res = await fetch("/api/password-manager", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          updates: { isFavorite: !currentFav },
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Marked as ${!currentFav ? "favorite" : "not favorite"}`);
        fetchEntries();
      } else {
        if (data.error == "jwt expired") {
          redirectToLogin();
          Swal.fire(
            "Error",
            "jwt expired, Login again to access your profile",
            "error"
          );
        } else {
          Swal.fire("Error", data.error, "error");
        }
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const highlightMatch = (text, term) => {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} style={{ backgroundColor: "#facc15", color: "#000" }}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    if (token) fetchEntries();
  }, [token]);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Password Manager</h2>

      <div className={styles.form}>
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
        <button onClick={addEntry} disabled={loading}>
          {loading ? "Saving..." : "Add Entry"}
        </button>
      </div>
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by title, username, or website..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className={styles.entries}>
        {entries
          .filter((entry) => {
            const term = searchTerm.toLowerCase();
            return (
              entry.title.toLowerCase().includes(term) ||
              entry.username.toLowerCase().includes(term) ||
              (entry.website && entry.website.toLowerCase().includes(term))
            );
          })
          .sort((a, b) => b.isFavorite - a.isFavorite)
          .map((entry) =>
            editingId === entry._id ? (
              <>
                <div className={styles.form} key={editingId + "-KEY"}>
                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    placeholder="Title"
                  />
                  <input
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm({ ...editForm, username: e.target.value })
                    }
                    placeholder="Username"
                  />
                  <input
                    type="text"
                    value={editForm.password}
                    onChange={(e) =>
                      setEditForm({ ...editForm, password: e.target.value })
                    }
                    placeholder="Password"
                  />
                  <input
                    value={editForm.website}
                    onChange={(e) =>
                      setEditForm({ ...editForm, website: e.target.value })
                    }
                    placeholder="Website"
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    <button onClick={updateEntry} disabled={editLoading}>
                      {editLoading ? "Saving..." : "Save"}
                    </button>
                    <button onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              </>
            ) : (
              <div key={entry._id} className={styles.entryCard}>
                <h4 className={styles.title}>
                  <Lock className={styles.icon} size={18} />
                  {highlightMatch(entry.title, searchTerm)}
                </h4>

                <p className={styles.row}>
                  <User2Icon size={16} className={styles.icon} />
                  <span>{highlightMatch(entry.username, searchTerm)}</span>

                  <button
                    className={styles.copyBtn}
                    onClick={() => {
                      navigator.clipboard.writeText(entry.username);
                      toast.success("Username copied!");
                    }}
                  >
                    <Copy size={16} />
                  </button>
                </p>

                <div className={styles.row}>
                  <Lock size={16} className={styles.icon} />
                  <span>
                    {showPassword[entry._id] ? entry.password : "••••••••"}
                  </span>
                  <div className={styles.buttonGroup}>
                    <button
                      className={styles.revealBtn}
                      onClick={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          [entry._id]: !prev[entry._id],
                        }))
                      }
                    >
                      {showPassword[entry._id] ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                    <button
                      className={styles.copyBtn}
                      onClick={() => {
                        navigator.clipboard.writeText(entry.password);
                        toast.success("Password copied!");
                      }}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                {entry.website && (
                  <a
                    href={
                      entry.website.startsWith("http")
                        ? entry.website
                        : `https://${entry.website}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.website}
                  >
                    Visit Site ↗
                  </a>
                )}

                <div className={styles.actions}>
                  <span className={styles.updatedAt}>
                    updated {format(entry.updatedAt)}
                  </span>

                  <button
                    onClick={() => toggleFavorite(entry._id, entry.isFavorite)}
                    className={styles.favoriteBtn}
                    title={
                      entry.isFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                  >
                    {entry.isFavorite ? (
                      <Star fill="gold" color="gold" size={18} />
                    ) : (
                      <StarOff size={18} />
                    )}
                  </button>

                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(entry)}
                    title="Edit"
                  >
                    Edit
                    <Pencil size={16} />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => deleteEntry(entry._id, entry.title)}
                    title="Delete"
                  >
                    Delete
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
}

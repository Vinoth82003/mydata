"use client";

import styles from "./ProjectManager.module.css";
import {
  Github,
  ExternalLink,
  FileText,
  Pencil,
  Trash2,
  PlusCircle,
  Tag,
  Layers,
  X,
  GlobeIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { format } from "timeago.js";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ProjectForm from "../ProjectForm/ProjectForm";

export default function ProjectManager({ redirectToLogin }) {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [showEnv, setShowEnv] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [token, setToken] = useState(null);

  const fetchProjects = async (token) => {
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setProjects(data.data);
      else toast.error(data.error || "Failed to fetch");
    } catch {
      toast.error("Server error");
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    if (!storedToken) return redirectToLogin();
    setToken(storedToken);
    fetchProjects(storedToken);
  }, []);

  const hasChanges = (original, updated) =>
    JSON.stringify({ ...original, updatedAt: "" }) !==
    JSON.stringify({ ...updated, updatedAt: "" });

  const handleSave = async (project) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      if (editProject) {
        if (!hasChanges(editProject, project)) {
          toast("No changes made");
          return;
        }
        const res = await fetch("/api/projects", {
          method: "PATCH",
          headers,
          body: JSON.stringify({ id: editProject._id, updates: project }),
        });
        const data = await res.json();
        if (data.success) {
          setProjects((prev) =>
            prev.map((p) => (p._id === data.data._id ? data.data : p))
          );
          toast.success("Updated");
        } else toast.error(data.error);
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers,
          body: JSON.stringify(project),
        });
        const data = await res.json();
        if (data.success) {
          setProjects((prev) => [data.data, ...prev]);
          toast.success("Added");
        } else {
          if (data.error === "jwt expired") {
            redirectToLogin();
            Swal.fire("Error", "Login expired, Login again", "error");
          } else {
            Swal.fire("Error", data.error, "error");
          }
        }
      }

      setModalOpen(false);
      setEditProject(null);
    } catch {
      toast.error("Server error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This project will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`/api/projects?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p._id !== id));
        toast.success("Deleted");
      } else toast.error(data.error);
    } catch {
      toast.error("Server error");
    }
  };

  const filtered = projects.filter((p) =>
    [p.title, p.description, ...p.tags, ...p.techStack]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <h2 style={{ marginBottom: "20px" }}>Your Project Data</h2>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <input
          type="text"
          placeholder="Search by title, tag or tech..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className={styles.addBtn}
          onClick={() => {
            setEditProject(null);
            setModalOpen(true);
          }}
        >
          <PlusCircle size={18} />
          Add Project
        </button>
      </div>

      {/* Cards */}
      <div className={styles.grid}>
        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <Layers size={48} strokeWidth={1.2} />
            <h3>No projects added yet</h3>
            <p>Start by clicking the "Add Project" button above.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <FileText size={48} strokeWidth={1.2} />
            <h3>No matching results</h3>
            <p>Try adjusting your search keywords.</p>
          </div>
        ) : (
          filtered.map((project) => (
            <motion.div
              key={project._id}
              className={styles.card}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.title}>{project.title}</h3>
              </div>

              <p className={styles.description}>{project.description}</p>

              {project?.techStack && project?.techStack.length > 0 && (
                <div className={styles.metaRow}>
                  <Layers size={16} className={styles.icon} />
                  <div className={styles.techStack}>
                    {project.techStack.map((tech, i) => (
                      <span key={i} className={styles.techChip}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {project?.tags && project?.tags.length > 0 && (
                <div className={styles.metaRow}>
                  <Tag size={16} className={styles.icon} />
                  <div className={styles.tagGroup}>
                    {project.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.linksRow}>
                <GlobeIcon size={16} className={styles.icon} />
                {project.repo && (
                  <a
                    href={project.repo}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.linkBtn}
                  >
                    <Github size={16} />
                    Repository
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.linkBtn}
                  >
                    <ExternalLink size={16} />
                    Live Site
                  </a>
                )}
                {(project.envGroups?.length > 0 || project.env?.length > 0) && (
                  <button
                    className={styles.linkBtn}
                    onClick={() =>
                      setShowEnv(showEnv === project._id ? null : project._id)
                    }
                  >
                    <FileText size={16} />
                    .env
                  </button>
                )}
              </div>

              {/* ENV GROUP DISPLAY */}
              {showEnv === project._id && (
                <motion.div
                  className={styles.envBlock}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  {/* envGroups View */}
                  {project.envGroups?.length > 0 &&
                    project.envGroups.map((group, i) => (
                      <div key={i} className={styles.envGroupBlock}>
                        <div className={styles.envGroupHeader}>
                          <strong>{group.groupName || `.env`}</strong>
                          <div className={styles.envTools}>
                            <button
                              onClick={() => {
                                const text = group.variables
                                  .map((e) => `${e.key}=${e.value}`)
                                  .join("\n");
                                navigator.clipboard.writeText(text);
                                toast.success(`Copied ${group.groupName}`);
                              }}
                            >
                              Copy
                            </button>
                            <button
                              onClick={() => {
                                const text = group.variables
                                  .map((e) => `${e.key}=${e.value}`)
                                  .join("\n");
                                const blob = new Blob([text], {
                                  type: "text/plain",
                                });
                                const link = document.createElement("a");
                                link.href = URL.createObjectURL(blob);
                                link.download = group.groupName || ".env";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                URL.revokeObjectURL(link.href);
                              }}
                            >
                              Download
                            </button>
                          </div>
                        </div>
                        <ul className={styles.envList}>
                          {group.variables.map((e, j) => (
                            <li key={j} className={styles.envItem}>
                              <div className={styles.envInputWrapper}>
                                <input
                                  type="text"
                                  className={styles.envKeyInput}
                                  value={e.key}
                                  readOnly
                                />
                                <input
                                  type="text"
                                  className={styles.envValueInput}
                                  value={e.value}
                                  readOnly
                                />
                                <button
                                  className={styles.copyBtn}
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      `${e.key}=${e.value}`
                                    );
                                    toast.success("Copied");
                                  }}
                                >
                                  Copy
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                  {/* Legacy flat env fallback */}
                  {project.env?.length > 0 && (
                    <div className={styles.envGroupBlock}>
                      <div className={styles.envGroupHeader}>
                        <strong>.env</strong>
                        <div className={styles.envTools}>
                          <button
                            onClick={() => {
                              const text = project.env
                                .map((e) => `${e.key}=${e.value}`)
                                .join("\n");
                              navigator.clipboard.writeText(text);
                              toast.success("Copied .env");
                            }}
                          >
                            Copy
                          </button>
                          <button
                            onClick={() => {
                              const text = project.env
                                .map((e) => `${e.key}=${e.value}`)
                                .join("\n");
                              const blob = new Blob([text], {
                                type: "text/plain",
                              });
                              const link = document.createElement("a");
                              link.href = URL.createObjectURL(blob);
                              link.download = ".env";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(link.href);
                            }}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                      <ul className={styles.envList}>
                        {project.env.map((e, i) => (
                          <li key={i} className={styles.envItem}>
                            <div className={styles.envInputWrapper}>
                              <input
                                type="text"
                                className={styles.envKeyInput}
                                value={e.key}
                                readOnly
                              />
                              <input
                                type="text"
                                className={styles.envValueInput}
                                value={e.value}
                                readOnly
                              />
                              <button
                                className={styles.copyBtn}
                                onClick={() => {
                                  navigator.clipboard.writeText(
                                    `${e.key}=${e.value}`
                                  );
                                  toast.success("Copied");
                                }}
                              >
                                Copy
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}

              <div className={styles.footer}>
                <span className={styles.updated}>
                  Updated {format(project.updatedAt)}
                </span>
                <div className={styles.buttons}>
                  <button
                    className={styles.editBtn}
                    onClick={() => {
                      setEditProject(project);
                      setModalOpen(true);
                    }}
                  >
                    <Pencil size={16} /> Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(project._id)}
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setModalOpen(false);
              setEditProject(null);
            }}
          >
            <motion.div
              className={styles.modalContent}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles.closeBtn}
                onClick={() => {
                  setModalOpen(false);
                  setEditProject(null);
                }}
              >
                <X size={20} />
              </button>
              <ProjectForm
                initialData={editProject}
                onSave={handleSave}
                onCancel={() => {
                  setModalOpen(false);
                  setEditProject(null);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

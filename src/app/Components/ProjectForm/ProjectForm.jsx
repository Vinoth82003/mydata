"use client";

import styles from "./ProjectForm.module.css";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, X, Upload } from "lucide-react";

export default function ProjectForm({ onSave, onCancel, initialData = null }) {
  const isEdit = !!initialData;

  const [form, setForm] = useState({
    title: "",
    description: "",
    repo: "",
    live: "",
    techStack: [],
    tags: [],
    env: [],
  });

  const [techInput, setTechInput] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [pasteEnvMode, setPasteEnvMode] = useState(false);
  const pasteEnvRef = useRef();

  useEffect(() => {
    if (isEdit) setForm(initialData);
  }, [initialData]);

  const addEnvRow = () => {
    setForm({ ...form, env: [...form.env, { key: "", value: "" }] });
  };

  const updateEnv = (i, field, value) => {
    const updated = [...form.env];
    updated[i][field] = value;
    setForm({ ...form, env: updated });
  };

  const removeEnvRow = (i) => {
    const updated = [...form.env];
    updated.splice(i, 1);
    setForm({ ...form, env: updated });
  };

  const addChip = (field, value, setter) => {
    if (!value.trim()) return;
    setForm({ ...form, [field]: [...form[field], value.trim()] });
    setter("");
  };

  const removeChip = (field, i) => {
    const updated = [...form[field]];
    updated.splice(i, 1);
    setForm({ ...form, [field]: updated });
  };

  const handleEnvFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    parseEnvText(text);
    e.target.value = ""; // reset file input
  };

  const parseEnvText = (text) => {
    const lines = text.split("\n");
    const parsed = lines
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const [key, ...rest] = line.split("=");
        return { key: key.trim(), value: rest.join("=").trim() };
      });
    setForm({ ...form, env: parsed });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;
    onSave(form);
  };

  return (
    <motion.form
      className={styles.form}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
    >
      <h2>{isEdit ? "Edit Project" : "Add Project"}</h2>

      <input
        placeholder="Project Title *"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Project Description *"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        required
      />

      <input
        placeholder="Repository URL"
        value={form.repo}
        onChange={(e) => setForm({ ...form, repo: e.target.value })}
      />
      <input
        placeholder="Live Site URL"
        value={form.live}
        onChange={(e) => setForm({ ...form, live: e.target.value })}
      />

      <div className={styles.chipInput}>
        <input
          placeholder="Tech Stack (Enter to add)"
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addChip("techStack", techInput, setTechInput);
            }
          }}
        />
        <div className={styles.chips}>
          {form.techStack.map((tech, i) => (
            <span key={i} className={styles.chip}>
              {tech}
              <X size={12} onClick={() => removeChip("techStack", i)} />
            </span>
          ))}
        </div>
      </div>

      <div className={styles.chipInput}>
        <input
          placeholder="Tags (Enter to add)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addChip("tags", tagInput, setTagInput);
            }
          }}
        />
        <div className={styles.chips}>
          {form.tags.map((tag, i) => (
            <span key={i} className={styles.chip}>
              #{tag}
              <X size={12} onClick={() => removeChip("tags", i)} />
            </span>
          ))}
        </div>
      </div>

      <div className={styles.envSection}>
        <div className={styles.envHeader}>
          <label>.env Variables</label>
          <div className={styles.envTools}>
            <button type="button" onClick={addEnvRow}>
              <Plus size={14} /> Add One
            </button>

            <label className={styles.uploadBtn}>
              <Upload size={14} /> Upload File
              <input
                type="file"
                accept=".env,.txt,.env.local,.local"
                hidden
                onChange={handleEnvFile}
              />
            </label>

            <button
              type="button"
              onClick={() => setPasteEnvMode(!pasteEnvMode)}
            >
              Paste .env
            </button>
          </div>
        </div>

        {pasteEnvMode && (
          <textarea
            ref={pasteEnvRef}
            placeholder="Paste your full .env content here..."
            className={styles.pasteEnv}
            onBlur={(e) => parseEnvText(e.target.value)}
          />
        )}

        {form.env.length > 0 && (
          <div className={styles.envList}>
            {form.env.map((env, i) => (
              <div key={i} className={styles.envRow}>
                <input
                  placeholder="KEY"
                  value={env.key}
                  onChange={(e) => updateEnv(i, "key", e.target.value)}
                />
                <input
                  placeholder="VALUE"
                  value={env.value}
                  onChange={(e) => updateEnv(i, "value", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeEnvRow(i)}
                  className={styles.removeBtn}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button type="submit" className={styles.saveBtn}>
          {isEdit ? "Update Project" : "Add Project"}
        </button>
        <button type="button" className={styles.cancelBtn} onClick={onCancel}>
          Cancel
        </button>
      </div>
    </motion.form>
  );
}

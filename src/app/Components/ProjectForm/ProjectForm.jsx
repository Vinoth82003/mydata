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
    envGroups: [],
  });

  const [techInput, setTechInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (isEdit) setForm(initialData);
  }, [initialData]);

  const updateField = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const updateEnvGroup = (i, group) => {
    const updated = [...form.envGroups];
    updated[i] = group;
    updateField("envGroups", updated);
  };

  const removeEnvGroup = (i) => {
    const updated = [...form.envGroups];
    updated.splice(i, 1);
    updateField("envGroups", updated);
  };

  const addEnvGroup = () =>
    updateField("envGroups", [
      ...form.envGroups,
      { groupName: "", variables: [] },
    ]);

  const addVariable = (i) => {
    const group = { ...form.envGroups[i] };
    group.variables = [...group.variables, { key: "", value: "" }];
    updateEnvGroup(i, group);
  };

  const updateVariable = (groupIdx, varIdx, field, value) => {
    const group = { ...form.envGroups[groupIdx] };
    group.variables[varIdx][field] = value;
    updateEnvGroup(groupIdx, group);
  };

  const removeVariable = (groupIdx, varIdx) => {
    const group = { ...form.envGroups[groupIdx] };
    group.variables.splice(varIdx, 1);
    updateEnvGroup(groupIdx, group);
  };

  const parseEnvText = (text) => {
    return text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const [key, ...rest] = line.split("=");
        return { key: key.trim(), value: rest.join("=").trim() };
      });
  };

  const handleEnvFile = async (e, groupIdx) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    const parsed = parseEnvText(text);
    const group = { ...form.envGroups[groupIdx] };
    group.variables = parsed;
    updateEnvGroup(groupIdx, group);
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
        onChange={(e) => updateField("title", e.target.value)}
        required
      />
      <textarea
        placeholder="Project Description *"
        value={form.description}
        onChange={(e) => updateField("description", e.target.value)}
        required
      />

      <input
        placeholder="Repository URL"
        value={form.repo}
        onChange={(e) => updateField("repo", e.target.value)}
      />
      <input
        placeholder="Live Site URL"
        value={form.live}
        onChange={(e) => updateField("live", e.target.value)}
      />

      {/* Tech Stack */}
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

      {/* Tags */}
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

      {/* 🔐 Env Groups */}
      <div className={styles.envSection}>
        <label style={{ marginBottom: "0.5rem" }}>.env Groups</label>
        <button type="button" onClick={addEnvGroup}>
          <Plus size={14} /> Add Group
        </button>

        {form.envGroups.map((group, i) => (
          <div key={i} className={styles.envGroup}>
            <div className={styles.envGroupHeader}>
              <input
                placeholder="Group Name (e.g. .env.local)"
                value={group.groupName}
                onChange={(e) =>
                  updateEnvGroup(i, { ...group, groupName: e.target.value })
                }
              />
              <button type="button" onClick={() => removeEnvGroup(i)}>
                <X size={16} />
              </button>
            </div>

            <div className={styles.envTools}>
              <button type="button" onClick={() => addVariable(i)}>
                <Plus size={14} /> Add Variable
              </button>
              <label className={styles.uploadBtn}>
                <Upload size={14} /> Upload
                <input
                  type="file"
                  accept=".env,.txt,.env.local"
                  hidden
                  onChange={(e) => handleEnvFile(e, i)}
                />
              </label>
              <button
                type="button"
                onClick={() => {
                  const pasted = prompt("Paste .env content:");
                  if (pasted) {
                    const parsed = parseEnvText(pasted);
                    const group = { ...form.envGroups[i] };
                    group.variables = parsed;
                    updateEnvGroup(i, group);
                  }
                }}
              >
                Paste
              </button>
            </div>

            <div className={styles.envList}>
              {group.variables.map((env, j) => (
                <div key={j} className={styles.envRow}>
                  <input
                    placeholder="KEY"
                    value={env.key}
                    onChange={(e) =>
                      updateVariable(i, j, "key", e.target.value)
                    }
                  />
                  <input
                    placeholder="VALUE"
                    value={env.value}
                    onChange={(e) =>
                      updateVariable(i, j, "value", e.target.value)
                    }
                  />
                  <button
                    type="button"
                    onClick={() => removeVariable(i, j)}
                    className={styles.removeBtn}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
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

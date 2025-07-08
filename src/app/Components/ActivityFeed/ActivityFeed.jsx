"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  FileText,
  Lock,
  AlertCircle,
  DatabaseBackup,
  User2,
  Calendar,
} from "lucide-react";
import styles from "./ActivityFeed.module.css";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

// Icons by category
const categoryIcons = {
  project: <DatabaseBackup className={styles.categoryIcon} />,
  todo: <FileText className={styles.categoryIcon} />,
  password: <Lock className={styles.categoryIcon} />,
  profile: <User2 className={styles.categoryIcon} />,
  event: <Calendar className={styles.categoryIcon} />,
};

export default function ActivityFeed() {
  const [groupedActivities, setGroupedActivities] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const grouped = {};
        (data.data || []).forEach((act) => {
          const group = act.type.split("_")[0];
          if (!grouped[group]) grouped[group] = [];
          grouped[group].push(act);
        });
        setGroupedActivities(grouped);
      })
      .catch(() => toast.error("Failed to load activity"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (Object.keys(groupedActivities).length === 0)
    return <p className={styles.empty}>No activity to show.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Activity Log</h2>

      <div className={styles.autoGrid}>
        {Object.entries(groupedActivities).map(([group, activities]) => (
          <div key={group} className={styles.groupCard}>
            <div className={styles.blockHeader}>
              {categoryIcons[group] || (
                <AlertCircle className={styles.categoryIcon} />
              )}
              <h3 className={styles.blockTitle}>
                {group.charAt(0).toUpperCase() + group.slice(1)} Activities
              </h3>
            </div>

            <ul className={styles.scrollList}>
              {activities.map((act) => (
                <li key={act._id} className={styles.item}>
                  <p className={styles.detail}>{act.detail}</p>
                  <span className={styles.time}>
                    <Clock size={14} className="inline mr-1" />
                    {formatDistanceToNow(new Date(act.createdAt), {
                      addSuffix: true,
                    })}
                    {" (" +
                      new Date(act.createdAt).toLocaleTimeString("en-IN") +
                      ")"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

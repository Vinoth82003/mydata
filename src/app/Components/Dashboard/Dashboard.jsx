"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import PageLoader from "../PageLoader/PageLoader";
import styles from "./Dashboard.module.css";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      let token = localStorage.getItem("accessToken");
      if (!token) return redirectToLogin();

      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          const res = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (!res.ok) throw new Error("Refresh failed");
          const data = await res.json();
          token = data.accessToken;
          localStorage.setItem("accessToken", token);
        }

        const res = await fetch("/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok) setUser(data.user);
        else redirectToLogin();
      } catch (err) {
        console.error(err);
        redirectToLogin();
      } finally {
        setLoading(false);
      }
    };

    const redirectToLogin = () => {
      localStorage.removeItem("accessToken");
      router.push("/signin");
    };

    checkToken();
  }, [router]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem("accessToken");
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/signin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  if (loading) return <PageLoader />;

  return user ? (
    <div>
      <h1>Welcome, {user.fname || user.email}</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </div>
  ) : (
    <PageLoader />
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import PageLoader from "../PageLoader/PageLoader";
import styles from "./Dashboard.module.css";
import Sidebar from "../Sidebar/Sidebar";
import Profile from "../Profile/Profile";
import Home from "../Home/Home";
import toast from "react-hot-toast";
import PasswordManager from "../PasswordManager/PasswordManager";
import ProjectManager from "../ProjectManager/ProjectManager";
import DashboardHome from "../DashboardHome/DashboardHome";
import TeamsCalendar from "../TeamsCalendar/TeamsCalendar";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Home");

  const redirectToLogin = () => {
    localStorage.removeItem("accessToken");
    router.push("/signin");
  };

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

          if (!res.ok) {
            redirectToLogin();
            throw new Error("Refresh failed");
          }
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

    checkToken();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoading(true);
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

  const handleUserUpdate = async (updatedData) => {
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (res.ok) {
        const userRes = await fetch("/api/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        const userData = await userRes.json();
        if (userRes.ok) {
          setUser(userData.user);
        }
        return true;
      } else {
        toast.error(data.error || "Update failed");
        return false;
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Something went wrong, Login and try again");
      return false;
    }
  };

  if (loading) return <PageLoader />;

  const initials =
    user?.fname?.[0]?.toUpperCase() + (user?.lname?.[0]?.toUpperCase() || "");

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar
        user={user}
        initials={initials}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onLogout={handleLogout}
        styles={styles}
      />

      <main className={styles.mainContent}>
        {activeMenu === "Home" && (
          <>
            {/* <h2 style={{ marginBottom: "10px" }}>
              Welcome, {user.fname || user.email}
            </h2> */}
            <DashboardHome user={user} />
          </>
        )}
        {activeMenu === "Profile" && (
          <>
            <h2>Profile, {user.fname || user.email}</h2>
            <Profile user={user} updateUser={handleUserUpdate} />
          </>
        )}
        {activeMenu === "Project Manager" && (
          <>
            <h2>Your Project Data,</h2>
            <ProjectManager redirectToLogin={redirectToLogin} />
          </>
        )}
        {activeMenu === "Password Manager" && (
          <>
            <h2>Your Data,</h2>
            <PasswordManager redirectToLogin={redirectToLogin} />
          </>
        )}
        {activeMenu === "Calendar" && <TeamsCalendar />}
        {activeMenu === "Notes" && <h2>Your Notes,</h2>}
        {activeMenu === "Todo" && <h2>Your Todo,</h2>}
        {activeMenu === "Settings" && <p>Settings coming soon!</p>}
      </main>
    </div>
  );
}

"use client";
import {
  Menu,
  LogOut,
  Home,
  User as UserIcon,
  Settings,
  CalendarDays,
  NotebookText,
  ListTodo,
  Shield,
  DatabaseBackup,
  ActivityIcon,
} from "lucide-react";

export default function Sidebar({
  user,
  initials,
  activeMenu,
  setActiveMenu,
  sidebarOpen,
  setSidebarOpen,
  onLogout,
  styles,
}) {
  const getInitialsColor = (name = "") => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 60%, 40%)`;
  };

  const menuItems = [
    { label: "Home", icon: <Home /> },
    { label: "Profile", icon: <UserIcon /> },
    { label: "Password Manager", icon: <Shield /> },
    { label: "Project Manager", icon: <DatabaseBackup /> },
    { label: "Calendar", icon: <CalendarDays /> },
    { label: "Todo", icon: <ListTodo /> },
    { label: "Activities", icon: <ActivityIcon /> },
    // { label: "Notes", icon: <NotebookText /> },
    // { label: "Settings", icon: <Settings /> },
  ];

  return (
    <aside
      className={`${styles.sidebar} ${
        sidebarOpen ? styles.open : styles.closed
      }`}
    >
      <div className={styles.logoSection}>
        {user?.image ? (
          <img src={user.image} alt="user" className={styles.userImage} />
        ) : (
          <div
            className={styles.userInitials}
            style={{
              backgroundColor: getInitialsColor(user?.email || user?.fname),
            }}
          >
            {initials}
          </div>
        )}
        {
          <span className={styles.userName}>
            {user.fname} {user.lname}
          </span>
        }
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={styles.menuToggle}
      >
        <Menu />
      </button>

      <nav className={styles.menu}>
        {menuItems.map(({ label, icon }) => (
          <div
            key={label}
            className={`${styles.menuItem} ${
              activeMenu === label && styles.active
            }`}
            onClick={() => setActiveMenu(label)}
          >
            {icon}
            {sidebarOpen ? (
              <span>{label}</span>
            ) : (
              <span className={styles.tooltip}>{label}</span>
            )}
          </div>
        ))}

        <div className={styles.menuItem} onClick={onLogout}>
          <LogOut />
          {sidebarOpen ? (
            <span>Logout</span>
          ) : (
            <span className={styles.tooltip}>Logout</span>
          )}
        </div>
      </nav>
    </aside>
  );
}

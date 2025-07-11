# 📦 MyData Manager

A full-stack project management and password manager application built with **Next.js**, **React**, and **MongoDB**.  
It features secure user authentication, customizable project management tools, a powerful calendar, and an encrypted password vault.

---

## 📑 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Available Scripts](#-available-scripts)
- [Environment Variables](#-environment-variables)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [Changelog](#-changelog)
- [License](#-license)
- [Contact](#-contact)

---

## 🧠 About

**MyData Manager** is a productivity suite built to help developers and individuals manage projects, sensitive credentials, notes, and tasks — all from a secure, customizable dashboard.

---

## ✨ Features

- 🧩 **Project Management** – Add/edit/delete projects with .env grouping
- 🔐 **Password Manager** – Secure AES-encrypted credential storage
- 🗓️ **Calendar** – Microsoft Teams-style week/day/month view calendar with drag and drop
- 📝 **Rich Blog Editor** – Medium-style blog publishing with TipTap, image upload, YouTube embed, and syntax highlighting
- 🔄 **Auth Flow** – Multi-step signup, OTP verification, JWT login, Google Auth
- 🌗 **Theme Support** – Light/dark theme toggle
- 🧾 **Audit Logging** – Activity feed for all major actions
- 💬 **Toast Alerts** – Realtime feedback with `react-hot-toast`
- 💾 **Encrypted .env Manager** – Upload, paste, or type secure grouped environment variables per project

---

## 🧰 Tech Stack

- **Frontend**: React 19, Next.js 15 (Turbopack)
- **Backend**: Node.js, Next.js API Routes
- **Database**: MongoDB (via Mongoose)
- **UI Libraries**: Tailwind CSS, Lucide React, Framer Motion, SweetAlert2
- **Authentication**: NextAuth (JWT, Google), OTP with Nodemailer
- **Calendar**: FullCalendar + React Big Calendar
- **Blob Storage**: Vercel Blob
- **Others**: TipTap, bcryptjs, dompurify, jwt-decode, uuid

---

## 🚀 Getting Started

### 📦 Installation

```bash
git clone https://github.com/Vinoth82003/mydata-manager.git
cd mydata-manager
npm install
```

### ▶️ Development

```bash
npm run dev
```

### 🚀 Production
```bash
npm run build
npm start
```
---

### 🧪 Available Scripts (from package.json)
|Script	|Description|
|---|------|
|dev	|Start dev server with turbopack|
|build	|Build the project|
|start	|Start production server|
|lint	|Run ESLint on source files|

---

### 🔐 Environment Variables
Create a `.env.local` file in your root with the following keys:

```bash
MONGODB_URI=mongodb://localhost:27017/mydata
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
JWT_SECRET=your_jwt_secret
ACCESS_SECRET=access_token_secret
REFRESH_SECRET=refresh_token_secret
ENCRYPTION_KEY=32_char_encryption_key
```
🔒 All secrets are encrypted at rest. Never commit this file.

---

## 🤝 Contributing
Contributions are welcome!

- Fork the repo

- Create a new branch: git checkout -b feature/your-feature

- Commit changes: git commit -m 'Add your feature'

- Push to the branch: git push origin feature/your-feature

- Submit a pull request

---

## 📜 Changelog
Version	Changes
`0.1.0`	Initial release with projects, auth, password manager, calendar

---

## 📄 License
This project is licensed under the MIT License.
See the LICENSE file for full details.

---

### 📬 Contact
Vinoth S
📧 vinothg0618@gmail.com
🌐 GitHub Profile

> Built with ❤️ by Vinoth S using the latest web stack technologies in 2025.
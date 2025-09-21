# 🚀 Laravel 12 + React (Inertia.js) Starter Kit with Roles & Permissions  

A modern **starter kit** built with **Laravel 12**, **React**, and **Inertia.js**, featuring a clean authentication flow, **role-based access control**, and **permission management** out of the box.  

---

## 📌 Features  
- 🔑 Authentication (Login, Register, Logout, Password Reset)  
- 👥 Role & Permission system (Admin, User, Moderator, etc.)  
- ⚡ Inertia.js setup for smooth Laravel + React integration  
- 🛠️ Pre-configured middleware & policies for access control  
- ⚛️ React components with client-side rendering powered by Inertia  
- 🎨 Easy UI customization (Tailwind/Bootstrap/Material UI ready)  
- 🗂️ Organized structure for scalable applications  
- 📦 Ready-to-use boilerplate to speed up development  

---

## 🛠️ Installation  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/kellywaves/my-starter-kit.git
cd laravel12-react-inertia-starter

composer install
npm install
cp .env.example .env
APP_NAME="StarterKit"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=starterkit_db
DB_USERNAME=root
DB_PASSWORD=

php artisan key:generate

composer run dev

├── app/              # Laravel backend (Models, Controllers, Policies, Middleware)
├── resources/js/     # React components (Inertia pages)
├── routes/web.php    # Routes with Inertia
├── database/         # Migrations & Seeders for roles/permissions
├── package.json      # Node.js dependencies
├── composer.json     # PHP dependencies
└── .env              # Environment variables


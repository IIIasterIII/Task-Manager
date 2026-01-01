<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=transparent&fontColor=FF0000&text=Full%20Stack%20Task%20Manager&fontSize=40&fontWeight=800" />
</p>
<p align="center">
  <a href="#description"><img src="https://img.shields.io/badge/-Description-black?style=flat-square"></a>
  <a href="#tech-stack"><img src="https://img.shields.io/badge/-Tech%20Stack-black?style=flat-square"></a>
  <a href="#installation"><img src="https://img.shields.io/badge/-Installation-black?style=flat-square"></a>
</p>

<div align="center">
  <video src="https://github.com/user-attachments/assets/3549a0db-106f-426f-9150-90bfdd28ab0f" width="100%" autoplay loop muted playsinline controls>
    Your browser does not support the video tag.
  </video>
</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=FF0000&height=2&section=header" width="100%"/>
<a id="description"></a>

## Task-Manager
is a full-stack web application based on Next.js and FastAPI. It features the ability to create tasks with specific deadlines, dynamic task management, priority setting, reordering, and editing at your discretion. It includes 6 custom UI styles and two authentication methods: the first via Google Auth, and the second via standard Gmail. If a user has not accessed the application for a long time, their session remains active until the refresh token expires! And finally, the most interesting part is the ability to set goals and thereby monitor your activity and progress.

https://github.com/user-attachments/assets/dc9049df-e8e2-4e8c-980d-1f16d147e6be

<img src="https://capsule-render.vercel.app/api?type=rect&color=FF0000&height=2&section=header" width="100%"/>

<a id="tech-stack"></a>
## Tech Stack

### Frontend Core
* <span style="color: #FF0000;">●</span> **Next.js** -> A powerful React-based framework that simplifies routing and handles both Server-Side Rendering (SSR) and Client-Side Rendering (CSR).
* <span style="color: #FF0000;">●</span> **React** -> A library for building user interfaces; a robust tool that groups HTML, CSS, and JS into reusable components.
* <span style="color: #FF0000;">●</span> **TypeScript** -> Similar to JavaScript but with strong static typing for the entire codebase.
### Libraries
* <span style="color: #FF0000;">●</span> **Motion** -> Handles component motion animations, including pop-up icons, fades, and more.
* <span style="color: #FF0000;">●</span> **Tailwind CSS** -> Allows for rapid styling directly within components (utility-first approach).
* <span style="color: #FF0000;">●</span> **Lucide React** -> A comprehensive set of icons for every use case.
* <span style="color: #FF0000;">●</span> **Next-themes** -> Provides support for multiple color themes across the site.
* <span style="color: #FF0000;">●</span> **Redux Toolkit & React-Redux** -> Enables global state management to avoid "prop drilling".
* <span style="color: #FF0000;">●</span> **Recharts** -> A library for creating beautiful and interactive data charts.
* <span style="color: #FF0000;">●</span> **Sonner** -> A library for generating sleek pop-up notifications (toast messages).

https://github.com/user-attachments/assets/70d61cd9-cb5f-4d75-9807-fec9a130d118

### Backend Core
* <span style="color: #FF0000;">●</span> **FastAPI** -> Backend framework on Python.
* <span style="color: #FF0000;">●</span> **MySQL** -> Database for storing application data.
* <span style="color: #FF0000;">●</span> **Redis** -> Database for caching, refresh tokens, and sessions.

### Backend Libraries
* <span style="color: #FF0000;">●</span> **Uvicorn** -> High-performance ASGI server.
* <span style="color: #FF0000;">●</span> **Pydantic** -> Data validation and settings management.
* <span style="color: #FF0000;">●</span> **SQLAlchemy** -> SQL Toolkit and Object Relational Mapper (ORM).
* <span style="color: #FF0000;">●</span> **Authlib** -> Comprehensive library for OAuth and social login.
* <span style="color: #FF0000;">●</span> **Passlib & Bcrypt** -> Secure password hashing and verification.

https://github.com/user-attachments/assets/af18e07f-3557-4793-bfa6-2aaee70f72c2

<a id="installation"></a>
## <img src="https://capsule-render.vercel.app/api?type=rect&color=FF0000&height=1&section=header" width="100%"/>
## Installation
```bash
git clone https://github.com/IIIasterIII/Task-Manager.git
cd Task-Manager
cd nextjs-frontend
npm install
mv .env.example .env  # Do not forget to fill in your variables
npm run build
npm run start

cd Task-Manager
cd fastapi-backend
python3 -m venv .venv
source .venv/bin/activate # For macOS/Linux:
.venv\Scripts\activate # For Windows
pip install --upgrade pip
pip install -r requirements.txt
mv .env.example .env  # Fill this file with your secrets
uvicorn main:app --reload # Default: localhost:8000
```
https://github.com/user-attachments/assets/3490ad71-7e54-4cca-913e-dc7d84cde45f

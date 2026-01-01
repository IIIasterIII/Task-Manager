# Task-Manager (FastAPI & Next.js)

## <img src="https://cdn-icons-png.flaticon.com/16/2989/2989937.png" width="16"> Table of Contents
1. [Description](#description)
2. [Demo](#demo)
3. [Tech Stack](#tech-stack)
4. [Installation & Setup](#installation--setup)
5. [API Usage](#api-usage)

<img src="https://capsule-render.vercel.app/api?type=rect&color=FF0000&height=2&section=header" width="100%"/>

## <img src="https://cdn-icons-png.flaticon.com/16/943/943960.png" width="16"> Description
**Task-Manager** is a high-performance full-stack application. It uses a FastAPI backend for robust data management and a Next.js frontend for a smooth, interactive user experience.

## <img src="https://cdn-icons-png.flaticon.com/16/4359/4359051.png" width="16"> Demo
<div align="center">
  <video src="https://github.com/user-attachments/assets/3549a0db-106f-426f-9150-90bfdd28ab0f" width="100%" autoplay loop muted playsinline controls>
    Your browser does not support the video tag.
  </video>
</div>

<img src="https://capsule-render.vercel.app/api?type=rect&color=FF0000&height=1&section=header" width="100%"/>

## <img src="https://cdn-icons-png.flaticon.com/16/2014/2014398.png" width="16"> Tech Stack

### <img src="https://cdn-icons-png.flaticon.com/16/8030/8030198.png" width="16"> Frontend Core
* <span style="color: #FF0000;">●</span> **Next.js** — A powerful React-based framework that simplifies routing and handles both Server-Side Rendering (SSR) and Client-Side Rendering (CSR).
* <span style="color: #FF0000;">●</span> **React** — A library for building user interfaces; a robust tool that groups HTML, CSS, and JS into reusable components.
* <span style="color: #FF0000;">●</span> **TypeScript** — Similar to JavaScript but with strong static typing for the entire codebase.

### <img src="https://cdn-icons-png.flaticon.com/16/4144/4144554.png" width="16"> Libraries & UI
* <span style="color: #FF0000;">●</span> **Motion** — Handles component motion animations, including pop-up icons, fades, and more.
* <span style="color: #FF0000;">●</span> **Tailwind CSS** — Allows for rapid styling directly within components (utility-first approach).
* <span style="color: #FF0000;">●</span> **Lucide React** — A comprehensive set of icons for every use case.
* <span style="color: #FF0000;">●</span> **Next-themes** — Provides support for multiple color themes across the site.
* <span style="color: #FF0000;">●</span> **Redux Toolkit & React-Redux** — Enables global state management to avoid "prop drilling".
* <span style="color: #FF0000;">●</span> **Recharts** — A library for creating beautiful and interactive data charts.
* <span style="color: #FF0000;">●</span> **Sonner** — A library for generating sleek pop-up notifications (toast messages).

## <img src="https://capsule-render.vercel.app/api?type=rect&color=FF0000&height=1&section=header" width="100%"/>
### Installation
```bash
git clone https://github.com/IIIasterIII/Task-Manager.git
cd Task-Manager
cd nextjs-frontend
npm install
mv .env.example .env  # Don't forget to fill in your variables
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

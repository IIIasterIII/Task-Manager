"use server"

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export interface ProjectData {
    name: string
    color: string
    parent_id: string | null
    is_favorite: boolean
  }

export async function createProject(data: ProjectData) {
    const cookieStore = await cookies()
    const allCookies = cookieStore.toString()
    try {
      const res = await fetch(`http://localhost:8000/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Cookie": allCookies },
        body: JSON.stringify(data),
      })
  
      if (!res.ok) return { error: "Ошибка сервера" }
      
      revalidatePath("/tasks") 
      return { success: true }
    } catch (e) {
      return { error: "Сетевая ошибка" }
    }
  }
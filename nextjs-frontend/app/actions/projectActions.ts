"use server"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export interface ProjectData {
  name: string
  color: string
  parent_id: number | null
  is_favorite: boolean
}

export async function createProject(data: ProjectData) {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()
  try {
    const payload = {
      name: data.name,
      color: data.color,
      parent_id: data.parent_id,
      favorite: data.is_favorite // mapping to match backend schema
    }

    const res = await fetch(`${process.env.BACKEND_URL}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": allCookies },
      body: JSON.stringify(payload),
    })
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      return { error: errorBody.detail || "Server error" };
    }
    const responseData = await res.json()
    revalidatePath("/tasks")
    return { success: true, data: responseData }
  } catch (e) {
    return { error: "Netword Error" }
  }
}

export async function getProjects() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/projects`, {
      method: "GET",
      headers: { "Content-Type": "application/json", "Cookie": allCookies }
    })
    if (!res.ok) return { error: "Server error" }
    revalidatePath("/tasks")
    const data = await res.json()
    return data
  } catch (e) {
    return { error: "Netword Error" }
  }
}
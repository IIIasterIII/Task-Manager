"use server"

import { revalidatePath } from "next/cache"
import { Task } from "../types/task"
import { cookies } from "next/headers"

export async function toggleTaskStatus(id: number, completed: boolean) {
  try {
    const res = await fetch(`http://localhost:8000/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_completed: completed }),
    })

    if (!res.ok) return { error: "Ошибка сервера" }
    
    revalidatePath("/tasks") 
    return { success: true }
  } catch (e) {
    return { error: "Сетевая ошибка" }
  }
}

export async function createTask(data: Task) {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()
  console.log(data)
  try {
    const res = await fetch("http://localhost:8000/task", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": allCookies},
      body: JSON.stringify(data)
    })

    if (!res.ok) return { error: "Server error"}

    revalidatePath("/task")
    return { success: true }
  } catch(err) {
    return { erorr: "Netword error"}
  }
}
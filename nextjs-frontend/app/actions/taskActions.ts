"use server"

import { revalidatePath } from 'next/cache';
import { Task } from "../types/task"
import { cookies } from "next/headers"
import { cache } from "react"

export async function toggleTaskStatus(id: number, completed: boolean) {
  try {
    const res = await fetch(`http://localhost:8000/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_completed: completed }),
    })

    if (!res.ok) return { error: "Netword Error" }
    
    revalidatePath("/tasks") 
    return { success: true }
  } catch (e) {
    return { error: "Netword Error" }
  }
}

export async function createTask(data: Task) {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()
  try {
    const res = await fetch("http://localhost:8000/task", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Cookie": allCookies},
      body: JSON.stringify(data)
    })


    if (!res.ok) return { error: "Server error"}
    const res_data = await res.json()
    revalidatePath("/task")
    return { data: res_data, success: true }
  } catch(err) {
    return { erorr: "Netword error"}
  }
}

export const getTasks = async (parent_id: number) => {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()

  try {
    const res = await fetch(`http://localhost:8000/tasksss/${parent_id}`, {
      method: "GET",
      headers: { 
        "Content-Type": "application/json", 
        "Cookie": allCookies 
      }})

    if (!res.ok) return { error: "Failed to fetch tasks", status: res.status }
    const data = await res.json()
    return { data, success: true }
  } catch (err) {
    return { error: "Network connection failed" }
  }
}

export const getTasksByDate = async (year: number, month: number) => {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()

  try {
    const res = await fetch(`http://localhost:8000/tasks_by_date/${year}/${month}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
        "Cookie": allCookies 
      }});
    
    if (!res.ok) return { error: "Fild", status: res.status}
    const data = await res.json();
    return { data, success: true}
  } catch (error) {
    console.error("Error:", error);
  }
}
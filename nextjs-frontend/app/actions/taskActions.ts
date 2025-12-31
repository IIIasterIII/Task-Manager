"use server"
import { goalDataToSend } from "../app/components/ui/goalCreation";
import { Priority, TaskCreate } from "@/app/types/task"
import { revalidatePath } from 'next/cache';
import { cookies } from "next/headers"

interface GoalProgressData {
  goal_id: number;
  task_id: number;
  value: number;
  entry_id: number;
  date: string;
}

const getHeaders = async () => {
    const cookieStore = await cookies()
    return {
        "Content-Type": "application/json",
        "Cookie": cookieStore.toString()
    }
}

export async function toggleTaskStatus(id: number, completed: boolean) {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/tasks/${id}`, {
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

export async function createTask(data: TaskCreate) {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/task`, {
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
    const res = await fetch(`${process.env.BACKEND_URL}/tasksss/${parent_id}`, {
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

export const getPinnedTaskIds = async () => {
  try {
      const res = await fetch(`${process.env.BACKEND_URL}/tasks/pinned`, {
          method: "GET",
          headers: await getHeaders()
      })
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
    const res = await fetch(`${process.env.BACKEND_URL}/tasks_by_date/${year}/${month}`, {
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

export const createGoal = async (data: goalDataToSend) => {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
        "Cookie": allCookies
      },
      body: JSON.stringify(data)
      });
      if (!res.ok) return { error: "Fild", status: res.status}
      const ress = await res.json();
      return { success: true, data: ress}
    } catch (error) {
      console.error("Error:", error);
    }
}

export const getGoals = async () => {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/goals`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
        "Cookie": allCookies
      } });
      if (!res.ok) return { error: "Fild", status: res.status}
      const ress = await res.json();
      return ress
    } catch (error) {
      console.error("Error:", error);
    }
}

export const getGoal = async (goal_id: number) => {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/goals/${goal_id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", 
        "Cookie": allCookies
      } });
      if (!res.ok) return { error: "Fild", status: res.status}
      const ress = await res.json();
      return ress
    } catch (error) {
      console.error("Error:", error);
    }
}

export const moveTask = async (direction: "up" | "down", project_id: number, task_id: number) => {
  const cookieStore = await cookies()
  const allCookies = cookieStore.toString()
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/tasks/move/${project_id}/${task_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json", 
        "Cookie": allCookies
      },
      body: JSON.stringify({ direction: direction })
    });
      if (!res.ok) return { error: "Fild", status: res.status}
      const ress = await res.json();
      return ress
    } catch (error) {
      console.error("Error:", error);
    }
}

export const updateTaskPriority = async (taskId: number, priority: Priority) => {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/tasks/${taskId}/priority`, {
            method: "PATCH",
            headers: await getHeaders(),
            body: JSON.stringify({ priority })
        })
        if (!res.ok) return { error: "Failed to update priority" }
        return await res.json()
    } catch (err) { return { error: "Network error" } }
}

export const updateTaskSchedule = async (taskId: number, date_at?: string, time_at?: string) => {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/tasks/${taskId}/schedule`, {
            method: "PATCH",
            headers: await getHeaders(),
            body: JSON.stringify({ date_at, time_at })
        })
        if (!res.ok) return { error: "Failed to update schedule" }
        return await res.json()
    } catch (err) { return { error: "Network error" } }
}

export const deleteTask = async (taskId: number) => {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/tasks/${taskId}/delete`, {
            method: "DELETE",
            headers: await getHeaders()
        })
        if (!res.ok) return { error: "Failed to delete task" }
        return { success: true }
    } catch (err) { return { error: "Network error" } }
}

export const togglePinTask = async (taskId: number, toPin: boolean) => {
  try {
      const res = await fetch(`${process.env.BACKEND_URL}/tasks/${taskId}/pin`, {
          method: "PATCH",
          headers: await getHeaders(),
          body: JSON.stringify({ toPin })
      })

      if (!res.ok) {
          const error = await res.json()
          return { error: error.detail || "Failed to toggle pin" }
      }

      return await res.json()
  } catch (err) { 
      return { error: "Network error" } 
  }
}

export const updateTaskDetails = async (
  taskId: number, 
  details: { title?: string; description?: string }
) => {
  try {
      const res = await fetch(`${process.env.BACKEND_URL}/tasks/${taskId}/details`, {
          method: "PATCH",
          headers: await getHeaders(),
          body: JSON.stringify(details)
      })

      if (!res.ok) {
          const error = await res.json()
          return { error: error.detail || "Failed to update details" }
      }

      return await res.json()
  } catch (err) {
      return { error: "Network error" }
  }
}

export const updateGoalProgress = async (data: GoalProgressData[]) => {
  try {
    const res = await fetch(`${process.env.BACKEND_URL}/goals/progress`, {
      method: "PATCH",
      headers: await getHeaders(),
      body: JSON.stringify(data)
    })
    if (!res.ok) {
      const error = await res.json()
      return { error: error.detail || "Failed to update goal progress" }
    }
    return await res.json()
  } catch (err) {
    return { error: "Network error" }
  }
}
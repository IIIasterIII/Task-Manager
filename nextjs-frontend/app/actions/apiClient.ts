"use server"

import { cookies } from "next/headers";

export async function deleteCookie() {
    const cookiesStore = await cookies()
    cookiesStore.delete("access_token")
    console.log("Cookie deleted!")
}

export async function getHistory() {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();
    try {
        const res = await fetch(`http://localhost:8000/history`, { method: "GET", headers: { "Content-Type": "application/json", "Cookie": allCookies },cache: 'no-store'})
        if (!res.ok) return { error: "Server error" };
        const data = await res.json(); 
        return { success: true, data };
    } catch(e) {
        return { error: "Network Error" };
    }
}
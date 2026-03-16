"use server"
import { cookies } from "next/headers";

export async function deleteCookie() {
    const cookiesStore = await cookies()
    cookiesStore.delete("access_token")
}

export async function getHistory() {
    const cookieStore = await cookies();
    const allCookies = cookieStore.toString();
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/history`, { method: "GET", headers: { "Content-Type": "application/json", "Cookie": allCookies }, cache: 'no-store' })
        if (!res.ok) return { error: "Server error" };
        const data = await res.json();
        return { success: true, data };
    } catch (e) {
        return { error: "Network Error" };
    }
}

interface UserData {
    username: string
    email: string
    password: string
    avatar: string
}

export const Postregister = async (data: UserData) => {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({}));
            return { error: errorBody.detail || "Server error" };
        }

        const resData = await res.json();
        return { success: true, resData };
    } catch (e) {
        return { error: "Network Error" };
    }
}

export const PostLogIn = async (email: string, password: string) => {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        if (!res.ok) {
            const errorBody = await res.json().catch(() => ({}));
            return { error: errorBody.detail || "Server error" };
        }

        const resData = await res.json()
        const token = resData.access_token
        const cookieStore = await cookies()
        cookieStore.set("access_token", token, { path: '/', maxAge: 3600, sameSite: 'lax' })
        return { success: true, resData }
    } catch (e) {
        return { error: "Network Error (Check CORS or Backend status)" };
    }
}


export async function checkMe() {
    const cookieStore = await cookies()
    const allCookies = cookieStore.toString()
    try {
        let res = await fetch(`${process.env.BACKEND_URL}/me`, {
            method: "POST",
            headers: { "Cookie": allCookies },
            cache: 'no-store'
        })
        if (res.status === 401) {
            const refreshRes = await fetch(`${process.env.BACKEND_URL}/refresh`, {
                method: "POST",
                headers: { "Cookie": allCookies },
                cache: 'no-store'
            })
            if (refreshRes.ok) {
                const newCookies = refreshRes.headers.get('set-cookie') || ""
                res = await fetch(`${process.env.BACKEND_URL}/me`, {
                    method: "POST",
                    headers: { "Cookie": newCookies || allCookies },
                    cache: 'no-store'
                })
            }
        }
        if (!res.ok) return { success: false, status: res.status }
        const data = await res.json()
        return { success: true, data }
    } catch (e) {
        return { success: false, error: "Network Error" }
    }
}
"use server"

import { cookies } from "next/headers";

export async function deleteCookie() {
    const cookiesStore = await cookies()
    cookiesStore.delete("access_token")
    console.log("Cookie deleted!")
}
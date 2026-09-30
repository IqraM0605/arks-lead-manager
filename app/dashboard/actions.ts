"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";

export async function createLead(formData: FormData) {
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
        redirect("/login");
    }

    const nameValue = formData.get("name");
    const needValue = formData.get("need");

    if (typeof nameValue !== "string" || typeof needValue !== "string") {
        throw new Error("Name and need must be text.");
    }

    const name = nameValue.trim();
    const need = needValue.trim();

    if (!name || name.length > 100 || !need || need.length > 300) {
        throw new Error("Name and need are required. Name must be 100 characters or fewer, and need must be 300 characters or fewer.");
    }

    const { error } = await supabase.from("leads").insert({ name, need });
    if (error) {
        throw new Error("Could not add the lead. Please try again.");
    }

    revalidatePath("/dashboard");
}

export async function signOut() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw new Error("Could not sign out. Please try again.");
    }

    redirect("/login");
}
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

    const name = String(formData.get("name") ?? "").trim();
    const need = String(formData.get("need") ?? "").trim();

    if (!name || !need) {
        return;
    }

    await supabase.from("leads").insert({ name, need });

    revalidatePath("/dashboard");
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
}
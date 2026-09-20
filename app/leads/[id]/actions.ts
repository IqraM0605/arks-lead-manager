"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase-server";
import { STAGES } from "@/lib/stages";

export async function updateStage(formData: FormData) {
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
        redirect("/login");
    }

    const id = Number(formData.get("id"));
    const stage = String(formData.get("stage") ?? "");

    if (!Number.isInteger(id) || !STAGES.includes(stage)) {
        return;
    }

    await supabase.from("leads").update({ stage }).eq("id", id);

    revalidatePath(`/leads/${id}`);
    revalidatePath("/dashboard");
}

export async function deleteLead(formData: FormData) {
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
        redirect("/login");
    }

    const id = Number(formData.get("id"));
    if (!Number.isInteger(id)) {
        return;
    }

    await supabase.from("leads").delete().eq("id", id);

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
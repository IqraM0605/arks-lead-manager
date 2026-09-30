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

    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error("Invalid lead ID.");
    }

    if (!STAGES.includes(stage)) {
        throw new Error("Invalid lead stage.");
    }

    const { data, error } = await supabase
        .from("leads")
        .update({ stage })
        .eq("id", id)
        .select("id");

    if (error) {
        throw new Error("Could not update the lead stage. Please try again.");
    }
    if (!data?.length) {
        throw new Error("Lead not found or stage was not updated.");
    }

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
    if (!Number.isSafeInteger(id) || id <= 0) {
        throw new Error("Invalid lead ID.");
    }

    const { data, error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id)
        .select("id");

    if (error) {
        throw new Error("Could not delete the lead. Please try again.");
    }
    if (!data?.length) {
        throw new Error("Lead not found; nothing was deleted.");
    }

    revalidatePath("/dashboard");
    redirect("/dashboard");
}
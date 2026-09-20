import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
        redirect("/login");
    }

    const { data: lead } = await supabase
        .from("leads")
        .select("*")
        .eq("id", Number(id))
        .maybeSingle();

    if (!lead) {
        return (
            <main>
                <h1>Lead not found</h1>
                <Link href="/dashboard">Back to dashboard</Link>
            </main>
        );
    }

    return (
        <main>
            <h1>{lead.name}</h1>
            <p>Need: {lead.need}</p>
            <p>Stage: {lead.stage}</p>
            <Link href="/dashboard">Back to dashboard</Link>
        </main>
    );
}
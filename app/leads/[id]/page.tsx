import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { STAGES } from "@/lib/stages";
import { updateStage, deleteLead } from "./actions";

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

            <form action={updateStage}>
                <input type="hidden" name="id" value={lead.id} />
                <select name="stage" defaultValue={lead.stage}>
                    {STAGES.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
                <button type="submit">Save stage</button>
            </form>

            <form action={deleteLead}>
                <input type="hidden" name="id" value={lead.id} />
                <button type="submit">Delete lead</button>
            </form>

            <Link href="/dashboard">Back to dashboard</Link>
        </main>
    );
}
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import { createLead, signOut } from "./actions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
        redirect("/login");
    }

    const { data, error } = await supabase.from("leads").select("*").order("id");

    if (error) {
        return (
            <main>
                <h1>Leads Dashboard</h1>
                <p>Could not load leads: {error.message}</p>
            </main>
        );
    }

    const leads = data ?? [];

    return (
        <main>
            <h1>Leads Dashboard</h1>

            <form action={signOut}>
                <button type="submit">Log out</button>
            </form>

            <h2>Add a lead</h2>
            <form action={createLead}>
                <input name="name" placeholder="Name" required />
                <input name="need" placeholder="What they need" required />
                <button type="submit">Add lead</button>
            </form>

            <h2>All leads</h2>
            <ul>
                {leads.map((lead) => (
                    <li key={lead.id}>
                        <Link href={`/leads/${lead.id}`}>{lead.name}</Link> - {lead.need} ({lead.stage})
                    </li>
                ))}
            </ul>
        </main>
    );
}
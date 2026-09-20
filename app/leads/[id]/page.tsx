import Link from "next/link";
import { leads } from "@/lib/leads";

export default async function LeadDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const lead = leads.find((l) => l.id === Number(id));

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
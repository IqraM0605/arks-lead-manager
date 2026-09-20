import Link from "next/link";
import { leads } from "@/lib/leads";

export default function DashboardPage() {
    return (
        <main>
            <h1>Leads Dashboard</h1>
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
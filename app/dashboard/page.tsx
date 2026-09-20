import Link from "next/link";

const leads = [
    { id: 1, name: "Rahul Sharma", need: "Website for bakery", stage: "New" },
    { id: 2, name: "Priya Patel", need: "Mobile app", stage: "Contacted" },
    { id: 3, name: "Amit Verma", need: "AI chatbot", stage: "Meeting booked" },
    { id: 4, name: "Sneha Rao", need: "Online store", stage: "Won" },
];

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
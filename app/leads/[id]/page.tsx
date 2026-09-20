import Link from "next/link";

const leads = [
    { id: 1, name: "Rahul Sharma", need: "Website for bakery", stage: "New" },
    { id: 2, name: "Priya Patel", need: "Mobile app", stage: "Contacted" },
    { id: 3, name: "Amit Verma", need: "AI chatbot", stage: "Meeting booked" },
    { id: 4, name: "Sneha Rao", need: "Online store", stage: "Won" },
];

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
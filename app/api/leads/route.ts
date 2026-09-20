import { NextResponse } from "next/server";
import { leads } from "@/lib/leads";

export async function GET() {
    return NextResponse.json(leads);
}

export async function POST(request: Request) {
    let body: { name?: unknown; need?: unknown } | null;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const need = typeof body?.need === "string" ? body.need.trim() : "";

    if (!name || !need) {
        return NextResponse.json(
            { error: "name and need are required" },
            { status: 400 }
        );
    }

    const newLead = {
        id: leads.length + 1,
        name,
        need,
        stage: "New",
    };
    leads.push(newLead);

    return NextResponse.json(newLead, { status: 201 });
}
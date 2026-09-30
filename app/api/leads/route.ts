import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

const MAX_NAME_LENGTH = 100;
const MAX_NEED_LENGTH = 300;

export async function GET() {
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const { data, error } = await supabase.from("leads").select("*").order("id");

    if (error) {
        console.error("Failed to fetch leads:", error);
        return NextResponse.json({ error: "Could not load leads" }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const supabase = await createClient();

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
        return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

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

    if (name.length > MAX_NAME_LENGTH || need.length > MAX_NEED_LENGTH) {
        return NextResponse.json(
            { error: "name must be 100 characters or fewer and need must be 300 characters or fewer" },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from("leads")
        .insert({ name, need })
        .select()
        .single();

    if (error) {
        console.error("Failed to create lead:", error);
        return NextResponse.json({ error: "Could not create lead" }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
    const { data, error } = await supabase.from("leads").select("*").order("id");

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
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

    const { data, error } = await supabase
        .from("leads")
        .insert({ name, need })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
}
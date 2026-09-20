import { NextResponse } from "next/server";
import { leads } from "@/lib/leads";

export async function GET() {
    return NextResponse.json(leads);
}
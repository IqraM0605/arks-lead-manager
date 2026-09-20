import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT =
    "You are a friendly assistant for a small web and AI services company. " +
    "Answer briefly. If you don't know something, say the team will follow up. " +
    "Never invent prices or promises.";

export async function POST(request: Request) {
    let body: { message?: unknown } | null;

    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message || message.length > 500) {
        return NextResponse.json(
            { error: "message is required (max 500 characters)" },
            { status: 400 }
        );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return NextResponse.json(
            { error: "Server is missing GEMINI_API_KEY" },
            { status: 500 }
        );
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
            contents: message,
            config: { systemInstruction: SYSTEM_PROMPT },
        });

        return NextResponse.json({ reply: response.text ?? "" });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "The AI service failed. Try again." },
            { status: 502 }
        );
    }
}
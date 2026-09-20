"use client";

import { useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

export default function ChatPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSend(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const text = input.trim();
        if (!text || loading) return;

        const next: Message[] = [...messages, { role: "user", content: text }];
        setMessages(next);
        setInput("");
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: next }),
            });
            const data = await res.json();

            if (!res.ok) {
                setError(data.error ?? "Something went wrong.");
            } else {
                setMessages([...next, { role: "assistant", content: data.reply }]);
            }
        } catch {
            setError("Could not reach the server.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main>
            <h1>Chat with us</h1>
            <p>Hi! Thanks for reaching out. How can we help you today?</p>

            <ul>
                {messages.map((m, i) => (
                    <li key={i}>
                        <strong>{m.role === "user" ? "You" : "Assistant"}:</strong> {m.content}
                    </li>
                ))}
            </ul>

            {loading && <p>Typing...</p>}
            {error && <p>{error}</p>}

            <form onSubmit={handleSend}>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message"
                    maxLength={500}
                />
                <button type="submit" disabled={loading}>
                    Send
                </button>
            </form>
        </main>
    );
}
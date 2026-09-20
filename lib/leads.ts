export type Lead = {
    id: number;
    name: string;
    need: string;
    stage: string;
};

export const leads: Lead[] = [
    { id: 1, name: "Rahul Sharma", need: "Website for bakery", stage: "New" },
    { id: 2, name: "Priya Patel", need: "Mobile app", stage: "Contacted" },
    { id: 3, name: "Amit Verma", need: "AI chatbot", stage: "Meeting booked" },
    { id: 4, name: "Sneha Rao", need: "Online store", stage: "Won" },
];
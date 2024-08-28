// app/home/page.js
"use client";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";

export default function Main() {
  const router = useRouter();

  const handleAddEvent = () => {
    router.push("/createevent");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Event Management</h1>
        <Button
          onClick={handleAddEvent}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Event
        </Button>
      </div>
    </div>
  );
}

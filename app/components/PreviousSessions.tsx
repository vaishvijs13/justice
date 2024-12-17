"use client";

import React, { useState, useEffect } from "react";

interface Session {
  id: number;
  date: string;
  file: string;
}

interface PreviousSessionsProps {
  sessions: Session[];
}
const PreviousSessions: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const response = await fetch("/api/sessions");
                if (!response.ok) {
                    throw new Error("Failed to fetch sessions");
                }
        
                const data: Session[] = await response.json();
                setSessions(data);
            }
            catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            }
            finally {
                setLoading(false);
            }
        };
    
        fetchSessions();
    }, []);

    return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Previous Sessions</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-slate-800">Session ID</th>
            <th className="p-2 text-slate-800">Date</th>
            <th className="p-2 text-slate-800">Uploaded File</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} className="border-b hover:bg-gray-100">
              <td className="p-2 text-slate-800">{session.id}</td>
              <td className="p-2 text-slate-800">{session.date}</td>
              <td className="p-2 text-slate-800">{session.file}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PreviousSessions;

"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useState } from "react";

interface StudentProps {
  id: string;
  name: string;
  student_id_display: string;
  phone: string;
  batch: { name: string; days: string[] } | null;
}

export function StudentList({ students }: { students: StudentProps[] }) {
  const [search, setSearch] = useState("");

  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.student_id_display.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-mu" size={18} />
        <input
          type="text"
          placeholder="Search students by name or ID..."
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-black/10 bg-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-black/10">
              <th className="pb-3 font-semibold text-mu">Student</th>
              <th className="pb-3 font-semibold text-mu">ID</th>
              <th className="pb-3 font-semibold text-mu">Phone</th>
              <th className="pb-3 font-semibold text-mu">Batch</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-mu">No students found.</td>
              </tr>
            ) : (
              filtered.map((student) => (
                <tr key={student.id} className="border-b border-black/5 last:border-0">
                  <td className="py-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center font-bold text-xs">
                      {student.name.charAt(0)}
                    </div>
                    {student.name}
                  </td>
                  <td className="py-4 text-mu">{student.student_id_display}</td>
                  <td className="py-4">{student.phone}</td>
                  <td className="py-4">
                    {student.batch ? <Badge variant="default">{student.batch.name}</Badge> : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

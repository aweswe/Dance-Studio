"use client";

import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "leave";
}

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
}

export function AttendanceCalendar({ records }: AttendanceCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  // Create calendar grid
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getStatusForDate = (day: number | null) => {
    if (!day) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const record = records.find(r => r.date.startsWith(dateStr));
    return record ? record.status : null;
  };

  const monthRecordCount = records.filter((r) =>
    r.date.startsWith(`${year}-${String(month + 1).padStart(2, "0")}`),
  ).length;

  return (
    <Card className="max-w-md mx-auto md:mx-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg">{monthNames[month]} {year}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-black/5 rounded-full"><ChevronLeft size={20} /></button>
          <button onClick={nextMonth} className="p-2 hover:bg-black/5 rounded-full"><ChevronRight size={20} /></button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs font-semibold text-mu">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
          <div key={day} className="py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, idx) => {
          const status = getStatusForDate(day);
          return (
            <div
              key={idx}
              className={cn(
                "h-10 w-10 mx-auto flex items-center justify-center rounded-full text-sm",
                day ? "hover:bg-black/5 cursor-default" : "",
                {
                  "bg-green/15 text-green font-bold": status === "present",
                  "bg-red-500/15 text-red-600 font-bold": status === "absent",
                  "bg-gold/15 text-gold font-bold": status === "leave",
                }
              )}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex gap-4 justify-center text-xs">
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-green/40"></div>Present</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-red-500/40"></div>Absent</div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gold/40"></div>Leave</div>
      </div>

      {monthRecordCount === 0 && (
        <p className="mt-4 text-center text-xs text-mu">No classes marked this month yet.</p>
      )}
    </Card>
  );
}

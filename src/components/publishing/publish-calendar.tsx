"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  getDay,
} from "date-fns";

interface CalendarJob {
  id: string;
  scheduledAt: Date;
  publishedAt?: Date;
  platform: string;
  status: string;
  articleTitle: string;
}

interface PublishCalendarProps {
  jobs: CalendarJob[];
  month: Date;
}

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getStatusColor(status: string): string {
  switch (status) {
    case "published":
      return "bg-green-500";
    case "pending":
      return "bg-blue-500";
    case "failed":
      return "bg-red-500";
    default:
      return "bg-zinc-400";
  }
}

function getStatusTextColor(status: string): string {
  switch (status) {
    case "published":
      return "text-green-600";
    case "pending":
      return "text-blue-600";
    case "failed":
      return "text-red-600";
    default:
      return "text-zinc-500";
  }
}

export function PublishCalendar({ jobs, month }: PublishCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  const jobsForDay = (day: Date) =>
    jobs.filter((job) => isSameDay(new Date(job.scheduledAt), day));

  const selectedJobs = selectedDay ? jobsForDay(selectedDay) : [];

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-6">
      <h3 className="mb-4 text-sm font-semibold text-zinc-700">
        {format(month, "MMMM yyyy")}
      </h3>

      <div className="grid grid-cols-7 gap-px">
        {weekDays.map((d) => (
          <div
            key={d}
            className="py-2 text-center text-xs font-medium text-zinc-500"
          >
            {d}
          </div>
        ))}

        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="p-2" />
        ))}

        {days.map((day) => {
          const dayJobs = jobsForDay(day);
          const isSelected = selectedDay && isSameDay(day, selectedDay);
          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-lg p-2 text-sm transition-colors hover:bg-zinc-50",
                isSelected && "bg-zinc-100 ring-1 ring-zinc-300"
              )}
            >
              <span className="text-zinc-700">{format(day, "d")}</span>
              {dayJobs.length > 0 && (
                <div className="flex gap-0.5">
                  {dayJobs.map((job) => (
                    <span
                      key={job.id}
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        getStatusColor(job.status)
                      )}
                    />
                  ))}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedDay && (
        <div className="mt-4 border-t border-zinc-100 pt-4">
          <h4 className="mb-2 text-xs font-semibold text-zinc-500">
            {format(selectedDay, "EEEE, MMM d")}
          </h4>
          {selectedJobs.length === 0 ? (
            <p className="text-xs text-zinc-400">No jobs scheduled</p>
          ) : (
            <div className="space-y-2">
              {selectedJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center justify-between rounded-md border border-zinc-100 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "h-2 w-2 rounded-full",
                        getStatusColor(job.status)
                      )}
                    />
                    <span className="text-sm text-zinc-800">
                      {job.articleTitle}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-500">
                      {job.platform}
                    </span>
                    <span
                      className={cn(
                        "text-xs font-medium capitalize",
                        getStatusTextColor(job.status)
                      )}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

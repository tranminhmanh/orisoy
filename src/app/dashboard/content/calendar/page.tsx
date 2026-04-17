import { CalendarDays } from "lucide-react";

export default function ContentCalendarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="h-6 w-6" />
          Content Calendar
        </h1>
        <p className="text-zinc-500 mt-1">
          Publishing schedule calendar view
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <CalendarDays className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Content calendar coming soon. Plan and visualize your publishing
          schedule across all channels.
        </p>
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Link2, Unlink } from "lucide-react";

interface PlatformCardProps {
  platform: string;
  isConnected: boolean;
  lastSync?: Date;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function PlatformCard({
  platform,
  isConnected,
  lastSync,
  onConnect,
  onDisconnect,
}: PlatformCardProps) {
  const displayName =
    platform.charAt(0).toUpperCase() + platform.slice(1);

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">
            {displayName}
          </h3>
          <div className="mt-1.5 flex items-center gap-1.5">
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                isConnected ? "bg-green-500" : "bg-red-500"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                isConnected ? "text-green-700" : "text-red-700"
              )}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>
        </div>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg",
            isConnected ? "bg-green-50" : "bg-zinc-50"
          )}
        >
          {isConnected ? (
            <Link2 className="h-4 w-4 text-green-600" />
          ) : (
            <Unlink className="h-4 w-4 text-zinc-400" />
          )}
        </div>
      </div>

      {lastSync && (
        <p className="mt-3 text-xs text-zinc-400">
          Last sync: {format(new Date(lastSync), "MMM d, yyyy HH:mm")}
        </p>
      )}

      <button
        onClick={isConnected ? onDisconnect : onConnect}
        className={cn(
          "mt-4 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
          isConnected
            ? "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
            : "border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
        )}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </button>
    </div>
  );
}

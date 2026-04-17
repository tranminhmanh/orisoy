import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="h-6 w-6" />
          Settings
        </h1>
        <p className="text-zinc-500 mt-1">
          API keys, project configuration, preferences
        </p>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center">
        <Settings className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
        <p className="text-zinc-400">
          Settings panel coming soon. Configure API keys, manage projects, and
          customize your preferences.
        </p>
      </div>
    </div>
  );
}

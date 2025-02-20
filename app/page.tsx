"use client"

import { useEffect, useState } from "react"
import type { Activity } from "@/activity-types"
import { ActivityItem } from "@/components/activity-item"
import { Timer } from "@/components/timer"
import { Statistics } from "@/components/statistics"
import { Plus, MoreVertical } from "lucide-react"
import { loadActivities } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function TimePage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    setActivities(loadActivities())
  }, [])

  const handleActivityAdded = (newActivities: Activity[]) => {
    setActivities(newActivities)
  }

  if (showStats) {
    return (
      <div className="max-w-md mx-auto h-screen flex flex-col bg-white">
        <header className="flex items-center justify-between px-4 py-3 border-b">
          <Button variant="ghost" onClick={() => setShowStats(false)}>
            Back
          </Button>
          <h1 className="text-lg font-medium">Statistics</h1>
          <div className="w-16" /> {/* Spacer for alignment */}
        </header>
        <main className="flex-1 overflow-auto">
          <Statistics activities={activities} />
        </main>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col bg-white">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div className="w-8 h-8">
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M3 12h4l3-9 4 18 3-9h4" />
          </svg>
        </div>
        <h1 className="text-lg font-medium">记录</h1>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost">
            <Plus className="w-5 h-5" />
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <Button variant="ghost" className="w-full justify-start" onClick={() => setShowStats(true)}>
                Statistics
              </Button>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      <main className="flex-1 overflow-auto">
        <Timer onActivityAdded={handleActivityAdded} />
        <div className="divide-y">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </div>
      </main>
    </div>
  )
}


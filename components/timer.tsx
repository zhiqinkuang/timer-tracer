"use client"

import { useState, useEffect, useCallback } from "react"
import { ActivityIcon } from "./activity-icon"
import { Button } from "@/components/ui/button"
import { addActivity } from "@/lib/storage"
import { type Activity, activityTypes } from "@/activity-types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function Timer({ onActivityAdded }: { onActivityAdded: (activities: Activity[]) => void }) {
  const [isRunning, setIsRunning] = useState(false)
  const [time, setTime] = useState(0)
  const [startTime, setStartTime] = useState<string>("")
  const [activityType, setActivityType] = useState<keyof typeof activityTypes>("work")

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }, [])

  const formatTimeString = useCallback((date: Date) => {
    return date.toTimeString().split(" ")[0]
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const handleStartStop = useCallback(() => {
    if (!isRunning) {
      // Start timer
      setStartTime(formatTimeString(new Date()))
      setTime(0)
    } else {
      // Stop timer and save activity
      const endTime = formatTimeString(new Date())
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: activityType,
        startTime,
        endTime,
        duration: formatTime(time),
        icon: activityTypes[activityType].icon,
        color: activityTypes[activityType].color,
      }
      const activities = addActivity(newActivity)
      onActivityAdded(activities)
    }
    setIsRunning(!isRunning)
  }, [isRunning, startTime, time, onActivityAdded, formatTime, formatTimeString, activityType])

  const handleActivityTypeChange = (type: keyof typeof activityTypes) => {
    if (!isRunning) {
      setActivityType(type)
    }
  }

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-neutral-100">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="icon" className="p-0">
            <ActivityIcon type={activityType} size="md" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid grid-cols-3 gap-2">
            {Object.entries(activityTypes).map(([type, { label }]) => (
              <Button
                key={type}
                variant="ghost"
                className={`flex flex-col items-center ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => handleActivityTypeChange(type as keyof typeof activityTypes)}
                disabled={isRunning}
              >
                <ActivityIcon type={type as keyof typeof activityTypes} size="sm" />
                <span className="mt-1 text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <div className="flex-1">
        <div className="text-2xl font-medium">{formatTime(time)}</div>
        <div className="text-sm text-neutral-500">
          {startTime || "Not started"} - {activityTypes[activityType].label}
        </div>
      </div>
      <Button variant="outline" className="w-20" onClick={handleStartStop}>
        {isRunning ? "Stop" : "Start"}
      </Button>
    </div>
  )
}


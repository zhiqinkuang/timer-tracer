"use client"

import { useState, useEffect, useCallback } from "react"
import { ActivityIcon } from "./activity-icon"
import { Button } from "@/components/ui/button"
import { addActivity, clearRecordsIfNeeded } from "@/lib/storage"
import { type Activity, activityTypes } from "@/activity-types"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function Timer({ onActivityAdded }: { onActivityAdded: (activities: Activity[]) => void }) {
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [activityType, setActivityType] = useState<keyof typeof activityTypes>("work")

  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }, [])

  useEffect(() => {
    clearRecordsIfNeeded();

    // 从 localStorage 中恢复状态
    const savedIsRunning = localStorage.getItem("isRunning") === "true";
    const savedStartTime = localStorage.getItem("startTime");
    const savedActivityType = localStorage.getItem("activityType");

    if (savedIsRunning && savedStartTime) {
      setIsRunning(true);
      setStartTime(Number(savedStartTime));
      setActivityType(savedActivityType as keyof typeof activityTypes);
    } else {
      // 如果没有恢复状态，重置 elapsedTime
      setElapsedTime(0);
    }

    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        if (startTime) {
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
        }
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, startTime])

  const handleStartStop = useCallback(() => {
    if (!isRunning) {
      // Start timer
      const now = Date.now();
      setStartTime(now);
      setElapsedTime(0); // 重置经过的时间
      localStorage.setItem("isRunning", "true");
      localStorage.setItem("startTime", now.toString());
      localStorage.setItem("activityType", activityType);
    } else {
      // Stop timer and save activity
      const endTime = new Date().toTimeString().split(" ")[0]
      const duration = formatTime(elapsedTime)
      const newActivity: Activity = {
        id: Date.now().toString(),
        type: activityType,
        startTime: new Date(startTime!).toTimeString().split(" ")[0],
        endTime,
        duration,
        icon: activityTypes[activityType].icon,
        color: activityTypes[activityType].color,
      }
      const activities = addActivity(newActivity)
      onActivityAdded(activities)

      // 清除状态
      setIsRunning(false);
      localStorage.removeItem("isRunning");
      localStorage.removeItem("startTime");
      localStorage.removeItem("activityType");
    }
    setIsRunning(!isRunning)
  }, [isRunning, startTime, onActivityAdded, formatTime, activityType, elapsedTime])

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
        <div className="text-2xl font-medium">{formatTime(elapsedTime)}</div>
        <div className="text-sm text-neutral-500">
          {startTime ? new Date(startTime).toTimeString().split(" ")[0] : "Not started"} - {activityTypes[activityType].label}
        </div>
      </div>
      <Button variant="outline" className="w-20" onClick={handleStartStop}>
        {isRunning ? "Stop" : "Start"}
      </Button>
    </div>
  )
}


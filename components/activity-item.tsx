import { ChevronRight } from "lucide-react"
import { type Activity, activityTypes } from "../activity-types"
import { ActivityIcon } from "./activity-icon"

interface ActivityItemProps {
  activity: Activity
}

export function ActivityItem({ activity }: ActivityItemProps) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-neutral-100">
      <ActivityIcon type={activity.type} size="sm" />
      <div className="flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-medium">{activity.duration}</span>
          <span className="text-neutral-600">{activityTypes[activity.type].label}</span>
        </div>
        <div className="text-sm text-neutral-500">
          {activity.startTime} -- {activity.endTime}
        </div>
      </div>
      <ChevronRight className="text-neutral-400" />
    </div>
  )
}


import { Bed, Bell, BookOpen, Globe, Laptop, type LucideIcon, UtensilsCrossed } from "lucide-react"
import { activityTypes } from "../activity-types"

const icons: Record<string, LucideIcon> = {
  Bed,
  Bell,
  BookOpen,
  Globe,
  Laptop,
  UtensilsCrossed,
}

interface ActivityIconProps {
  type: keyof typeof activityTypes
  size?: "sm" | "md" | "lg"
}

export function ActivityIcon({ type, size = "md" }: ActivityIconProps) {
  const { color, icon } = activityTypes[type]
  const Icon = icons[icon]

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  return (
    <div className={`flex items-center justify-center rounded-full ${color} ${sizeClasses[size]}`}>
      <Icon className={`text-white ${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"}`} />
    </div>
  )
}


import type { Activity } from "@/activity-types"
import { getCurrentDate } from './utils'; // 假设您有一个获取当前日期的工具函数

const STORAGE_KEY = "time-tracker-activities"

let lastClearedDate = getCurrentDate();

function clearRecordsIfNeeded() {
    const currentDate = getCurrentDate();
    if (currentDate !== lastClearedDate) {
        clearRecords(); // 清空记录的函数
        lastClearedDate = currentDate; // 更新最后清空日期
    }
}

// 每分钟检查一次是否需要清空记录
setInterval(clearRecordsIfNeeded, 60 * 1000);

// 在适当的位置调用这个函数，例如在应用启动时
clearRecordsIfNeeded();

export function saveActivities(activities: Activity[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(activities))
}

export function loadActivities(): Activity[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function addActivity(activity: Activity) {
  const activities = loadActivities()
  activities.unshift(activity)
  saveActivities(activities)
  return activities
}

export function loadActivitiesByDate(date: string): Activity[] {
    const activities = loadActivities();
    return activities.filter(activity => activity.date === date); // 假设活动对象有一个 date 属性
}


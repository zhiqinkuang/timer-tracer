import type { Activity } from "@/activity-types"
import { getCurrentDate } from './utils'; // 假设您有一个获取当前日期的工具函数

const STORAGE_KEY = "time-tracker-activities"
const LAST_CLEARED_KEY = "last-cleared-date"; // 存储上次清除日期的键

function clearRecords() {
    localStorage.removeItem(STORAGE_KEY); // 清空存储中的活动记录
}

export function clearRecordsIfNeeded() {
    const currentDate = getCurrentDate();
    const lastClearedDate = localStorage.getItem(LAST_CLEARED_KEY); // 从 localStorage 获取上次清除日期

    // 如果上次清除日期不存在或不是今天，则清空记录并更新上次清除日期
    if (!lastClearedDate || lastClearedDate !== currentDate) {
        clearRecords(); // 清空记录的函数
        localStorage.setItem(LAST_CLEARED_KEY, currentDate); // 更新上次清除日期
    }
}

// 在适当的位置调用这个函数，例如在应用启动时
// clearRecordsIfNeeded(); // 确保在需要的地方调用

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


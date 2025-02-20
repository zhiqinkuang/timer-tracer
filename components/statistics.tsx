"use client"

import { type Activity, activityTypes } from "@/activity-types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import ReactECharts from 'echarts-for-react'

interface StatisticsProps {
  activities: Activity[]
}

export function Statistics({ activities }: StatisticsProps) {
  // 检查活动数据
  if (!activities || !Array.isArray(activities)) {
      console.error("Invalid activities data:", activities);
      return null; // 或者返回一个适当的占位符
  }

  // 检查活动类型
  if (!activityTypes || typeof activityTypes !== 'object') {
      console.error("Invalid activityTypes data:", activityTypes);
      return null; // 或者返回一个适当的占位符
  }

  const getDurationInMinutes = (duration: string) => {
    const [hours, minutes, seconds] = duration.split(":").map(Number)
    return hours * 60 + minutes + seconds / 60
  }

  // Calculate current day's activities
  const today = new Date().toLocaleDateString()
  const todayActivities = activities.filter((activity) => new Date(Number(activity.id)).toLocaleDateString() === today)

  // Prepare data for charts
  const chartData = Object.entries(activityTypes)
    .map(([type, { label }]) => {
      const typeMinutes = todayActivities
        .filter((a) => a.type === type)
        .reduce((acc, activity) => acc + getDurationInMinutes(activity.duration), 0)
      return {
        name: label,
        value: Number((typeMinutes / 60).toFixed(2)),
        color: activityTypes[type].color,
      }
    })
    .filter((item) => item.value > 0)

  const pieOption = {
    title: {
      text: "Today's Activity Distribution",
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: 'Activity',
        type: 'pie',
        radius: '50%',
        data: chartData.map(({ name, value, color }) => ({ name, value, itemStyle: { color } })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  }

  const barOption = {
    title: {
      text: "Today's Activities (Hours)",
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: chartData.map(({ name }) => name)
    },
    series: [
      {
        type: 'bar',
        data: chartData.map(({ value, color }) => ({ value, itemStyle: { color } }))
      }
    ]
  }

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Today's Activity Distribution</CardTitle>
          <CardDescription>Distribution of time spent on different activities today</CardDescription>
        </CardHeader>
        <CardContent>
          <ReactECharts option={pieOption} style={{ height: 400 }} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Today's Activities (Hours)</CardTitle>
          <CardDescription>Time spent on each activity today</CardDescription>
        </CardHeader>
        <CardContent>
          <ReactECharts option={barOption} style={{ height: 400 }} />
        </CardContent>
      </Card>
    </div>
  )
}

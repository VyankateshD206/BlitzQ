"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "./chart"
import { formatTimeForChart } from "./utils/formatTime"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#2563eb",
  },
  mobile: {
    label: "Mobile",
    color: "#60a5fa",
  },
} satisfies ChartConfig

function DrawTimeChart({ chartData }: { chartData: Array<{ timeTaken: number }> }) {
  // Transform data to include question index
  const transformedData = chartData.map((item, index) => ({
    ...item,
    questionIndex: index + 1, // Adding 1 to make it 1-based
  }))

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={transformedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid vertical={false} />
          <ChartTooltip content={<ChartTooltipContent formatter={(value) => <strong>Time Taken : {formatTimeForChart(value)}</strong>}/>} />
          <XAxis
              dataKey="questionIndex"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return `Q ${value}`
              }}
            />
          <Line
            type="monotone"
            dataKey="timeTaken"
            name="Time Taken"
            stroke={chartConfig.desktop.color}
            strokeWidth={2}
            activeDot={{ r: 8 }}
            />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default DrawTimeChart
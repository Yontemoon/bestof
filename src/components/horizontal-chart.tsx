'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useRouter } from 'next/navigation'

export const description = 'A horizontal bar chart'

const chartConfig = {
  movie: {
    label: 'movie',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

type PropTypes = {
  chartData: {
    movie: string
    count: number
  }[]
}

export function ChartBarHorizontal({ chartData }: PropTypes) {
  const router = useRouter()

  return (
    <Card>
      <CardHeader>
        <CardTitle>The Top Movies Most Mentioned</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto"
          style={{ height: Math.max(chartData.length * 44, 220) }}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="movie"
              type="category"
              width={180}
              interval={0}
              tickLine={false}
              tickMargin={12}
              axisLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value: string) =>
                value.length > 28 ? `${value.slice(0, 28)}...` : value
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent formatter={(value) => `${value} votes`} />}
            />
            <Bar
              dataKey="count"
              fill="var(--chart-1)"
              radius={5}
              //   onClick={(item) => {
              //     router.push(`/content/${}`)
              //     console.log(item)
              //   }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

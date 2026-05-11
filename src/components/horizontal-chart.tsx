'use client'

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useRouter } from 'next/navigation'
import { Content } from '@/payload-types'

export const description = 'A horizontal bar chart'

const chartConfig = {
  movie: {
    label: 'movie',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

type PropTypes = {
  chartData: {
    movie: Content
    count: number
  }[]
}

export function ChartBarHorizontal({ chartData }: PropTypes) {
  const router = useRouter()

  // Need category and year
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top 10 for Movies of 2025</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="movie.title"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="count" fill="var(--color-chart-1)" radius={4}>
              <LabelList
                dataKey="movie.title"
                position="insideLeft"
                offset={8}
                className="fill-(--color-label)"
                fontSize={12}
              />
              <LabelList
                dataKey="count"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

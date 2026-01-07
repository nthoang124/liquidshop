import { Bar, BarChart, CartesianGrid, Cell, Rectangle, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ChartColumn } from "lucide-react"

export interface BarChartItem {
  label: string
  value: number
  color: string
}

export interface BarChartConfigItem {
  label: string
  color: string
}

export interface BarChartProps {
  chartData: BarChartItem[],
  chartConfig: Record<string, BarChartConfigItem>,
  dataKey: string,
  titelChart: string,
  subTitle: string
}

export function ChartBarActive({chartData, chartConfig, titelChart, subTitle} : BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-1 items-center">
          <ChartColumn color="#299D8D"/> 
            {titelChart}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.slice(0)
              }
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="value"
              strokeWidth={2}
            //   barSize={60}
              fill="var(--color-value)"
              radius={8}
              activeIndex={2}
              activeBar={({ ...props }) => {
                return (
                  <Rectangle
                    {...props}
                    fillOpacity={0.8}
                    stroke={props.payload.fill}
                    strokeDasharray={4}
                    strokeDashoffset={4}
                  />
                )
              }}
            >
               {chartData.map((entry) => (
                <Cell
                    key={entry.label}
                    fill={entry.color ?? chartConfig.value.color}
                />
               ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">
            {subTitle}
        </div>
      </CardFooter>
    </Card>
  )
}

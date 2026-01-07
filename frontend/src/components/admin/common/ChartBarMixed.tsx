import { ChartColumn } from "lucide-react"
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts"

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

export const description = "A mixed bar chart"

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

export function ChartBarMixed({chartData, chartConfig, titelChart, subTitle} : BarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-row gap-1 items-center"> 
          <ChartColumn color="#f17604"/> 
          {titelChart}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              className="font-semibold text-sm md:text-[0.85rem]"
              dataKey="label"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                value.slice(8)
              }
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar 
              dataKey="value" 
              fill="var(--color-value)" 
              layout="vertical" radius={5}
              barSize={10}
            >
                {chartData.map((item, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={item.color}  
                    />
                ))}
                <LabelList
                    dataKey="value"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium text-muted-foreground">
          {subTitle}
        </div>
      </CardFooter>
    </Card>
  )
}

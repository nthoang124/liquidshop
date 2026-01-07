import type { IProduct } from './product';
export interface ChartSeries {
  labels: string[]
  data: number[]
}

export interface TopUser {
  id: number
  fullName: string
  email: string
  role: string
  createdAt?: string
}

export interface DashboardTotals {
  ordersLastMonth: number
  ordersThisMonth: number
  users: number
  products: number
  revenueThisYear: number
  revenueLastYear: number
  revenueThisMonth: number
  revenueLastMonth: number
}

export interface DashboardOverview {
  usersNew7Days: ChartSeries
  revenue7Days: ChartSeries
  revenue12Months: ChartSeries
  topProducts: IProduct[]
  topNewUsers: TopUser[]
  totals: DashboardTotals
}

export interface IDashboardResponse {
  success?: boolean
  data: DashboardOverview
}

import type { IProduct } from './product';
export interface ChartSeries {
  labels: string[]
  data: number[]
}

export interface TopUser {
  _id: number
  fullName: string
  email: string
  role: string
  createdAt?: string
  avatarUrl?: string
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

export interface IDashboardResponse {
  usersNew7Days: ChartSeries
  revenue7Days: ChartSeries
  revenue12Months: ChartSeries
  topProducts: IProduct[]
  topNewUsers: TopUser[]
  totals: DashboardTotals
}

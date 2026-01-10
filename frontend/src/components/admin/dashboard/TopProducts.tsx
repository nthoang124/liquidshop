import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpRight, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import type { IProduct } from "@/types/product"
import { formatVND } from "@/utils/admin/formatMoney"
import { Link } from "react-router-dom"

interface TopProductsProps {
    products: IProduct[];
}

const PRODUCT_STATUS = {
  active: "Đang bán",
  inactive: "Không còn bán",
  out_of_stock: "Hết hàng"
} as const

export function TopProducts({products} : TopProductsProps) {
  return (
    <Card className="w-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 px-8 pt-8">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
            Top Sản phẩm bán chạy
          </CardTitle>
          <CardDescription className="text-muted-foreground/70 font-medium">
            Phân tích hiệu suất 5 sản phẩm dẫn đầu doanh thu
          </CardDescription>
        </div>
        <button className="h-10 w-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center hover:bg-slate-100 transition-colors group">
          <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
        </button>
      </CardHeader>

      <CardContent className="p-0 pt-4">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="hover:bg-transparent border-b-slate-100">
              <TableHead className="w-[300px] pl-8 py-4 uppercase text-[0.75rem] md:text-[0.85rem] font-bold tracking-[0.1em] text-slate-400">
                Sản phẩm
              </TableHead>
              <TableHead className="uppercase text-[0.75rem] md:text-[0.85rem] font-bold tracking-[0.1em] text-slate-400">
                Số lượng
              </TableHead>
              <TableHead className="uppercase text-[0.75rem] md:text-[0.85rem] font-bold tracking-[0.1em] text-slate-400">
                Doanh thu
              </TableHead>
              <TableHead className="uppercase text-[0.75rem] md:text-[0.85rem] font-bold tracking-[0.1em] text-slate-400">
                Đã bán
              </TableHead>
              <TableHead className="pr-8 text-right uppercase text-[0.75rem] md:text-[0.85rem] font-bold tracking-[0.1em] text-slate-400">
                Trạng thái
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product._id}
                className="group border-b-slate-50 transition-all duration-300 hover:bg-slate-50/30"
              >
                <TableCell className="pl-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 rounded-xl shrink-0 overflow-hidden bg-slate-100 border border-slate-200/50 shadow-sm transition-transform group-hover:scale-105 duration-300">
                      <img
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <Link to={`/admin/product/edit/${product._id}`}>
                        <span className="font-bold text-slate-900 line-clamp-2 max-w-50 text-wrap leading-none group-hover:text-primary transition-colors">
                          {product.name}
                        </span>
                      </Link>
                      <span className="text-xs text-slate-400 font-medium">{product.category.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-slate-300" />
                    <span className="font-bold text-slate-700">{product.stockQuantity}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    {formatVND(product.price * product.soldCount)}
                  </div>
                </TableCell>
                <TableCell>
                  <div
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[0.8rem] md:text-[0.9rem] font-bold",
                      product.soldCount > 100
                        ? "text-rose-600 bg-rose-50/50"
                        : "text-emerald-600 bg-emerald-50/50"
                    )}
                  >
                    {product.soldCount}
                  </div>
                </TableCell>
                <TableCell className="pr-8 text-right">
                  <span
                    className={cn(
                      "text-[0.8rem] md:text-[0.85rem] font-bold px-2 py-1 rounded-md border",
                      product.status === "active" && "bg-green-50 text-green-600 border-slate-100",
                      product.status === "inactive" && "bg-amber-50 text-amber-600 border-amber-100",
                      product.status === "out_of_stock" && "bg-rose-50 text-rose-600 border-rose-100",
                    )}
                  >
                    {PRODUCT_STATUS[product.status]}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

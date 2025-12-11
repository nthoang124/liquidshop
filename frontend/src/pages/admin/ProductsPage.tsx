import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import ProductsDisplay from "@/components/admin/products/products-view"

import type { IProduct } from "@/services/api/admin/product"
import productApi from "@/services/api/admin/productApi"
import type { ProductQuery } from "@/services/api/admin/query"
import brandApi from "@/services/api/admin/brandApi"
import type { IBrand } from "@/types/brand"
import type { ICategory } from "@/types/category"
import categoryApi from "@/services/api/admin/categoryApi"
import { Input } from "@/components/ui/input"
import { Crown, LayoutGrid, LucidePackage, SearchX, X } from "lucide-react"
import { DeleteCategoryAlert } from "@/components/admin/category/delete-category-alert"
import { useNavigate } from "react-router-dom"


export default function ProductsPage() {
  // Gộp tất cả sản phẩm thành 1 list

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [page, setPage] = useState(1);
  const limit = 12;
  const [totalPages, setTotalPages] = useState<number>(1);

  const [totalProducts, setTotalProducts] = useState(0);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IProduct | null>(null);

  const navigate = useNavigate();


  const isFiltered =
  selectedBrand !== "all" ||
  selectedCategory !== "all" ||
  selectedStatus !== "all";


  const loadProducts = async () => {
    try {
      const params: ProductQuery = {
        page,
        limit,
        search,
      }
      if (selectedBrand !== "all") params.brand = selectedBrand;
      if (selectedCategory !== "all") params.category = selectedCategory;
      if (selectedStatus !== "all") params.status = selectedStatus;

      const res = await productApi.getAll(params);
      setProducts(res.data.data);
      setTotalPages(res.data.totalPages);
      setTotalProducts(res.data.count);
    }
    catch(error){
      console.log(error);
    }
    finally{
      setIsLoading(false);
    }
  }

  const loadBrands = async () => {
    try {
      const res = await brandApi.getAll();
      setBrands(res.data.data);
    }catch(error){
      console.log(error);
    }
  }

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data.data);
    }catch(error){
      console.log(error);
    }
  }

  const onEdit = (id: string) => {
    navigate(`/admin/product/edit/${id}`);
  }

  const onDelete = (product: IProduct) => {
    setDeleteTarget(product);
    setOpenDeleteAlert(true);
    confirmDelete();
  }

  const confirmDelete = async () => {
    try {
      if(!deleteTarget) return;

      await productApi.delete(deleteTarget._id);
      loadProducts();
    }catch(err){
        console.log(err);
    }
  }

  useEffect(() => {
    const deleteData = async () => {
      confirmDelete();
    }
    deleteData();
  }, [])

  useEffect(() => {
    try{
      const fetchData = async () => {
        await loadProducts();
        await loadBrands()
        await loadCategories()
      }
      fetchData();
    }
    catch(error){
      console.log(error)
    }
  }, [selectedBrand, selectedCategory, selectedStatus, page, search])

  return (
    <div className="space-y-6 p-5">
      {isLoading && (
        <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
      )}
      <div className="bg-white">
        <div className="flex flex-col bg-white mt-4 px-8 gap-3 border-b border-gray-300 pb-3 pt-3">
          <p className="text-2xl lg:text-3xl font-bold mt-3">Quản lí sản phẩm</p>
          <p className="text-md md:text-lg text-gray-600">Quản lí thông tin sản phẩm, kho hàng và danh mục</p>
        </div>

        <div className="flex flex-col bg-white md:flex-row gap-4 items-center justify-center mt-4 px-6 py-3">
          <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm hover:shadow-md transition w-full md:w-1/3 flex items-center justify-between">
              <p className="text-lg font-semibold">Sản phẩm</p>
              <div className="flex flex-row items-center gap-2">
                <p className="text-xl lg:text-2xl font-bold">{totalProducts}</p>
                <LayoutGrid size={32} color="#146bdb" />
              </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm hover:shadow-md transition w-full md:w-1/3 flex items-center justify-between">
              <p className="text-lg font-semibold">Thương hiệu</p>
              <div className="flex flex-row items-center gap-2">
                <p className="text-xl lg:text-2xl font-bold">{brands.length}</p>
                <Crown size={32} color="#e1c614" />
              </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl md:flex-col lg:flex-row p-6 shadow-sm hover:shadow-md transition w-full md:w-1/3 flex items-center justify-between">
              <p className="text-lg font-semibold">Danh mục</p>
              <div className="flex flex-row items-center gap-2">
                <p className="text-xl lg:text-2xl font-bold">{categories.length}</p>
                <LucidePackage size={32} color="#10b238" />
              </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white h-40 sm:h-30 lg:h-15 lg:flex-row gap-3 lg:gap-0 items-start justify-start lg:justify-between p-2">
        <Input 
          placeholder="Tìm kiếm theo tên sản phẩm"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          className="max-w-lg w-full bg-white text-md border-2 border-gray-400"
        />  
        
        <div className="flex flex-col sm:flex-row items-center justify-start gap-1 sm:gap-2">

          {isFiltered && (
            <Button variant="outline" onClick={() => {
                setSearch("");
                setSelectedBrand("all");
                setSelectedCategory("all");
                setSelectedStatus("all");
              }}
              className="hidden sm:flex w-26"
            >
              <X/>
              Xoá bộ lọc
            </Button>
          )}

          {/* lọc theo thương hiệu */}
          <Select value={selectedBrand} onValueChange={(selectedBrand) => setSelectedBrand(selectedBrand)}>
            <SelectTrigger><SelectValue placeholder="Thương hiệu" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Thương hiệu</SelectItem>
              {brands.map(b => (
                <SelectItem key={b._id} value={b._id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <div className="flex flex-row gap-2">
              <Select value={selectedCategory} onValueChange={(selectedCategory) => setSelectedCategory(selectedCategory)}>
                <SelectTrigger><SelectValue placeholder="Loại"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Loại</SelectItem>
                  {categories.map(c => (
                    <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* {Lọc theo trạng thái} */}
              <Select value={selectedStatus} onValueChange={(selectedStatus) => setSelectedStatus(selectedStatus)}>
                <SelectTrigger><SelectValue placeholder="Trạng thái" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Trạng thái</SelectItem>
                  <SelectItem value="active">Đang bán</SelectItem>
                  <SelectItem value="inactive">Ngừng bán</SelectItem>
                  <SelectItem value="out_of_stock">Hết hàng</SelectItem>
                </SelectContent>
              </Select>
          </div>
          {/* {lọc theo loại sản phẩm} */}
          
        </div>
      </div>

      {/* Product Grid */}
      {!isLoading && products.length === 0 &&(
        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
          <SearchX className="w-12 h-12 mb-3 opacity-70" />
          <span className="text-lg font-semibold">Không tìm thấy dữ liệu</span>
          <span className="text-sm mb-3">Thử dùng từ khóa khác hoặc reset tìm kiếm.</span>

          <Button variant="outline" onClick={() => {
            setSearch("");
            setSelectedBrand("all");
            setSelectedCategory("all");
            setSelectedStatus("all");
          }}>
            Xoá bộ lọc
          </Button>
        </div>
      )}

      {!isLoading && products.length > 0 && (
        <ProductsDisplay 
          products={products} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}

      <DeleteCategoryAlert
        open={openDeleteAlert}
        setOpen={setOpenDeleteAlert}
        categoryName={deleteTarget?.name}
        onConfirm={confirmDelete}
      />

      {/* Pagination */}
      <div className="flex justify-center gap-2 mt-8">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </Button>

        {Array.from({length: totalPages}, (_, idx) => (
          <Button
            key={idx}
            variant={page === idx + 1 ? "default" : "outline"}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

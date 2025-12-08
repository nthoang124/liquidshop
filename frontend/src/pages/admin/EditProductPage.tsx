import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import productApi from "@/services/api/admin/productApi";
import brandApi from "@/services/api/admin/brandApi";
import categoryApi from "@/services/api/admin/categoryApi";

import type { IProduct } from "@/services/api/admin/product";
import type { IBrand } from "@/types/brand";
import type { ICategory } from "@/types/category";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState<IProduct | null>(null);

  const [brands, setBrands] = useState<IBrand[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local fields
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [stockQuantity, setStockQuantity] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("active");
  const [images, setImages] = useState<string[]>([]);
  const [specifications, setSpecifications] = useState<Record<string, string>>({});

  // Load brands + categories
  const loadMeta = async () => {
    const resBrand = await brandApi.getAll();
    const resCat = await categoryApi.getAll();
    setBrands(resBrand.data.data);
    setCategories(resCat.data.data);
  };

  // Load product by ID
  const loadProduct = async () => {
    try {
      const res = await productApi.getById(id!);
      const p: IProduct = res.data.data;
      setProduct(p);

      setName(p.name);
      setSku(p.sku);
      setDescription(p.description || "");
      setPrice(p.price);
      setOriginalPrice(p.originalPrice || 0);
      setStockQuantity(p.stockQuantity);
      setCategory(p.category?._id || "");
      setBrand(p.brand?._id || "");
      setStatus(p.status);
      setImages(p.images);
      setSpecifications(p.specifications);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Save product
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name,
        sku,
        description,
        price,
        originalPrice,
        stockQuantity,
        category,
        brand,
        status,
        images,
        specifications,
      };

      await productApi.update(id!, payload);
      navigate("/admin/products");
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadMeta();
    loadProduct();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;

  return (
    <div className="p-6 space-y-6 bg-white border rounded-lg">

      <h1 className="text-2xl font-bold">Chỉnh sửa sản phẩm</h1>
      <p className="text-gray-600">Cập nhật thông tin chi tiết sản phẩm</p>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Product Name */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Tên sản phẩm</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* SKU */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">SKU</label>
          <Input value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Giá bán</label>
          <Input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>

        {/* Original Price */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Giá gốc</label>
          <Input type="number" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} />
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Tồn kho</label>
          <Input type="number" value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} />
        </div>

        {/* Status */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Trạng thái</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Đang bán</SelectItem>
              <SelectItem value="inactive">Ngừng bán</SelectItem>
              <SelectItem value="out_of_stock">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Danh mục</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c._id} value={c._id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Thương hiệu</label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Thương hiệu" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b._id} value={b._id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold">Mô tả</label>
        <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {/* Images */}
      <div>
        <h3 className="font-semibold mb-2">Hình ảnh</h3>
        <div className="flex gap-3 flex-wrap">
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              className="w-28 h-28 object-cover rounded-lg border"
              alt="Product"
            />
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex justify-end gap-3 pt-5">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Hủy
        </Button>

        <Button disabled={saving} onClick={handleSave}>
          {saving ? "Đang lưu..." : "Lưu sản phẩm"}
        </Button>
      </div>

    </div>
  );
}

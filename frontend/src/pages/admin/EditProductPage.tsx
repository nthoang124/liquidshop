import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import productApi from "@/services/api/admin/productApi";
import brandApi from "@/services/api/admin/brandApi";
import categoryApi from "@/services/api/admin/categoryApi";

import type { IProduct } from "@/services/api/admin/product";
import type { IBrand } from "@/types/brand";
import type { ICategory } from "@/types/category";
import { ChevronLeft, CircleCheckBig, CircleX, Save } from "lucide-react";
import { ImagesInput, TagsInput } from "@/components/admin/products/string-array-input";
import { SpecificationsInput } from "@/components/admin/products/product-specs";
import type { AxiosError } from "axios";
import { PRODUCT_ERROR_MESSAGES } from "@/utils/admin/errorMessages";

export default function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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
  const [detailedInfo, setDetailedInfo] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);

  // message response from server
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

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

      console.log(res.data.data);

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
      setDetailedInfo(p.detailedInfo);
      setTags(p.tags);

      console.log(p);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // update product
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

      const res = await productApi.update(id!, payload);

      if(res.data.success === true) {
        setFormSuccess(res.data.message);
        setFormError("");
      }

      console.log("check form success: ", formSuccess)

      navigate("/admin/products/list");
    } catch (err: unknown) {
      console.log(err);

      const error = err as AxiosError<{message: string}>
      const backendMsg = error.message ?? "";
      const vietnameseMsg = PRODUCT_ERROR_MESSAGES[backendMsg] ?? "Có lỗi xảy ra! Vui lòng thử lại.";
      setFormError(vietnameseMsg);
      setFormSuccess("");

    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadMeta();
    loadProduct();
  }, []);

  const handleComeBack = () => {
    navigate("/admin/products/list");
  }

  if (loading) return <p className="text-center text-gray-500">Đang tải dữ liệu...</p>;

  return (
    <div className="p-2 md:p-4 space-y-6 border rounded-lg">
        <div className="flex flex-col bg-white mt-0 gap-3 border-b border-gray-300 p-3 pt-3">
            <Button 
                className="bg-white border border-gray-300 w-25 hover:bg-white hover:shadow-md justify-start text-black flex items-center gap-1"
                onClick={() => handleComeBack()}
            >
                <ChevronLeft size={28} color="black" strokeWidth={2.25}/>
                quay về
            </Button>
            <p className="text-2xl lg:text-3xl font-bold">Cập nhật sản phẩm</p>
            <p className="text-sm md:text-base text-gray-600">Cập nhật thông tin sản phẩm</p>
        </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border bg-white border-gray-300 p-3 rounded-md">

        {/* Product Name */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Tên sản phẩm</label>
          <input className="input-pro" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {/* SKU */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">SKU</label>
          <input className="input-pro" value={sku} onChange={(e) => setSku(e.target.value)} />
        </div>

        {/* Price */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Giá bán</label>
          <input className="input-pro" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
        </div>

        {/* Original Price */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Giá gốc</label>
          <input className="input-pro" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} />
        </div>

        {/* Stock */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Tồn kho</label>
          <input className="input-pro" type="number" value={stockQuantity} onChange={(e) => setStockQuantity(Number(e.target.value))} />
        </div>

          {/* Category */}
         <div className="flex flex-col gap-1">
          <label className="font-semibold">Danh mục</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full"> 
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

        {/* {detail infor} */}
        <div className="flex flex-col gap-1 md:col-span-2">
          <label className="font-semibold">Thông tin chi tiết</label>
          <Textarea className="text-[0.85rem]" value={detailedInfo} onChange={(e) => setDetailedInfo(e.target.value)} />
        </div>
        
        {/* {specs infor} */}
        <SpecificationsInput specs={specifications} setSpecs={setSpecifications}/>

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

        {/* {Tag} */}
        <TagsInput values={tags} setValues={setTags}/>

      </div>

      <div className="bg-white p-3 rounded-md border border-gray-300">      
        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Mô tả</label>
          <Textarea className="text-[0.85rem] md:text-[0.9rem]" rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>    

        {/* Images */}
        <div className="space-y-3">
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
          <ImagesInput images={images} setImages={setImages}/>
        </div>

        {/* {response message} */}
        {formSuccess && (
          <div className="flex flex-row gap-2">
          <CircleCheckBig size={25} strokeWidth={2.5} color="#42bf40" />
          <span className="text-lg text-green-500">Thêm danh mục mới thành công</span>
          </div>
        )}
        {formError && (
          <div className="flex flex-row gap-2">
          <CircleX color="#f00a0a" strokeWidth={2.5} />
          <span className="text-lg text-red-500">{formError}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-end gap-3 pt-5">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Hủy
          </Button>

          <Button 
            disabled={saving} 
            onClick={handleSave}
            className="bg-blue-500 font-medium text-sm md:text-[0.9rem] text-white hover:bg-blue-600"
          >
            <Save/>
            {saving ? "Đang lưu..." : "Lưu sản phẩm"}
          </Button>
        </div>
      </div>
    </div>
  );
}

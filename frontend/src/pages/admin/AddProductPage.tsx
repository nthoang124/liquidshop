import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import productApi from "@/services/api/admin/productApi";
import brandApi from "@/services/api/admin/brandApi";
import categoryApi from "@/services/api/admin/categoryApi";

import type { IBrand } from "@/types/brand";
import type { ICategory } from "@/types/category";
import { ChevronLeft, CircleCheckBig, CircleX } from "lucide-react";
import { SpecificationsInput } from "@/components/admin/products/product-specs";
import { ImagesInput, TagsInput } from "@/components/admin/products/string-array-input";
import { PRODUCT_ERROR_MESSAGES } from "@/utils/admin/errorMessages";
import type { AxiosError } from "axios";

export default function EditProductPage() {

  const navigate = useNavigate();

  const [brands, setBrands] = useState<IBrand[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

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
  const [detailedInfo, setDetailedInfo] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  // Load brands + categories
  const loadMeta = async () => {
    const resBrand = await brandApi.getAll();
    const resCat = await categoryApi.getAll();
    setBrands(resBrand.data.data);
    setCategories(resCat.data.data);
  };

  // response message from server
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  // create product
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name,
        sku,
        description,
        detailedInfo,
        price,
        originalPrice,
        stockQuantity,
        images,
        category,
        brand,
        specifications,
        status,
        tags,
      };

      console.log("check payload: ", payload)

      await productApi.create(payload);

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
  }, []);

  const handleComeBack = () => {
    navigate("/admin/products/list");
  }


  return (
    <div className="p-6 space-y-6 bg-white border rounded-lg">
        <div className="flex flex-col bg-white mt-0 px-1 gap-3 border-b border-gray-300 pb-3 pt-3">
            <Button 
                className="bg-white border border-gray-300 w-25 hover:bg-white hover:shadow-md justify-start text-black flex items-center gap-1"
                onClick={() => handleComeBack()}
            >
                <ChevronLeft size={28} color="black" strokeWidth={2.25}/>
                quay về
            </Button>
            <p className="text-2xl lg:text-3xl font-bold">Thêm sản phẩm</p>
            <p className="text-md md:text-lg text-gray-600">Thêm thông tin sản phẩm mới</p>
        </div>

      {/* FORM GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-300 p-3 rounded-md">

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

        {/* {detail infor} */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold">Thông tin chi tiết</label>
          <Input type="text" value={detailedInfo} onChange={(e) => setDetailedInfo(e.target.value)} />
        </div>

        {/* {specifications infor} */}
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
                <SelectItem value=" ">Không</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b._id} value={b._id ?? ""}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* {tag inPut} */}
        <TagsInput values={tags} setValues={setTags}/>

      </div>

      {/* Description */}
      <div className="flex flex-col gap-1">
        <label className="font-semibold">Mô tả</label>
        <Textarea rows={5} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {/* Images */}
      <div>
        <h3 className="font-semibold mb-2">Hình ảnh</h3>
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
          className="bg-blue-500 font-bold text-base text-white hover:bg-blue-600"
        >
          {saving ? "Đang lưu..." : "Thêm"}
        </Button>
      </div>

    </div>
  );
}

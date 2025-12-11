import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import categoryApi from "@/services/api/admin/categoryApi"
import type { ICategory } from "@/types/category"
import { CategoryCombobox } from "@/components/admin/category/category-combobox"
import { CircleCheckBig, CircleX } from "lucide-react"
import { AxiosError } from "axios"

//maping message from backend server
import { CATEGORY_ERROR_MESSAGES } from "@/utils/admin/errorMessages"

export default function AddCategoryPage() {
  const [name, setName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [description, setDescription] = useState("")
  const [categories, setCategories] = useState<ICategory[]>([])
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [parentCategory, setParentCategory] = useState<ICategory | null>(null);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleSubmit = async () => {
    try {
      const newCategory = {
        name,
        imageUrl,
        description,
        ...(parentCategory && { parentCategory: parentCategory._id }),
      };
      const res = await categoryApi.create(newCategory);
      console.log(newCategory);

      console.log("Created: ", res.data)
      if(res.data.success === true) {
        setFormSuccess(res.data.message);
        setFormError("");
      }

    } catch (err: unknown) {

      const error = err as AxiosError<{ message: string }>;
      const backendMsg = error.message ?? "";
      const vietnameseMsg =
        CATEGORY_ERROR_MESSAGES[backendMsg] ?? "Có lỗi xảy ra! Vui lòng thử lại.";

      setFormError(vietnameseMsg);
      setFormSuccess("");
    }
  }

  const loadCategories = async () => {
    try {
        const res = await categoryApi.getAll();
        setCategories(res.data.data);
    }
    catch(err){
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
        await loadCategories();
    }
    fetchData();
  },[]);

  return (
    <div className="flex flex-col gap-5 shadow-sm p-5">
      <div className="flex flex-col bg-white mt-4 px-8 gap-3 border-b border-gray-300 pb-3 pt-3">
        <p className="text-2xl lg:text-3xl font-bold">Thêm danh mục</p>
        <p className="text-md md:text-lg text-gray-600">Tạo mới danh mục</p>
      </div>
      <div className="bg-white border-gray-200 shadow-md p-4 min-h-screen">
        <div className="flex justify-center">
          <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mt-4 rounded-md px-3">
            <CardHeader>
              <CardTitle className="text-xl md:text-2xl">Danh mục</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <Label className="text-md md:text-lg">Tên Danh mục</Label>
                <Input className="h-12 focus-visible:ring-2 
                                focus-visible:ring-blue-500 
                                  focus-visible:ring-offset-0" 
                  value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div>
                <Label className="text-md md:text-lg">Ảnh hiển thị</Label>
                <Input className="h-12 focus-visible:ring-2 
                                focus-visible:ring-blue-500 
                                  focus-visible:ring-offset-0"  
                  value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
              </div>

              <div>
                <Label className="text-md md:text-lg">Mô tả</Label>
                <Input className="h-12 focus-visible:ring-2 
                                focus-visible:ring-blue-500 
                                  focus-visible:ring-offset-0" 
                  value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              <div className="space-y-1">
                <Label className="text-md md:text-lg">Danh mục cha</Label>
                <CategoryCombobox
                  open={comboboxOpen}
                  categories={categories}
                  setOpen={setComboboxOpen}
                  setParentCategory={setParentCategory}
                />
              </div>

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
              
            </CardContent>

            <CardFooter className="justify-end gap-2">
              <Button className="text-lg font-bold bg-blue-500 hover:bg-blue-600" onClick={handleSubmit}>Thêm mới</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

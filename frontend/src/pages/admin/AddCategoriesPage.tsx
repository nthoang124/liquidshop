import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import categoryApi from "@/services/api/admin/categoryApi"
import { useNavigate } from "react-router-dom"
import type { ICategory } from "@/types/category"

export default function AddCategoryPage() {
  const [name, setName] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [description, setDescription] = useState("")
  const [categories, setCategories] = useState<ICategory[]>([])

  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const newCategory = { name, imageUrl, description }
      const res = await categoryApi.create(newCategory)

      console.log("Created:", res.data)

      navigate("/admin/categories/list") // chuyển về danh sách sau khi tạo thành công
    } catch (err) {
      console.log("Error:", err)
    }
  }

  const loadCategories = async () => {
    try {
        const res = await categoryApi.getAll();
        setCategories(res.data);
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
    <div className="flex flex-col gap-5 p-5">
      <span className="text-lg md:text-2xl text-gray-600 font-bold">Thêm loại sản phẩm</span>
      <div className="flex justify-center">
        <Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Loại sản phẩm</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div>
              <Label className="text-md md:text-lg">Tên loại sản phẩm</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label className="text-md md:text-lg">Ảnh hiển thị</Label>
              <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
            </div>

            <div>
              <Label className="text-md md:text-lg">Mô tả</Label>
              <Input value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </CardContent>

          <CardFooter className="justify-end gap-2">
            <Button variant="outline" onClick={() => navigate(-1)}>Hủy</Button>
            <Button onClick={handleSubmit}>Thêm</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

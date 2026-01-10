import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import type { ICategory, IParentCategory } from "@/types/category"
import { CategoryCombobox } from "./category-combobox"
import { CircleX } from "lucide-react"

interface EditCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: ICategory | null;
  categories: ICategory[];
  onSave: (updated: ICategory) => void;
  formError: string | undefined;
  isEddit: boolean;
}


export function EditCategoryDialog({open, setOpen, category, categories, onSave, formError, isEddit} : EditCategoryDialogProps){
    const [name, setName] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");
    const [parentCategory, setParentCategory] = useState<IParentCategory | null>(null);
    const [comboboxOpen, setComboboxOpen] = useState(false);

    const handleSave = () => {
        const updated: ICategory = {
            _id: category?._id || "",
            name,
            imageUrl,
            description,
            parentCategory
        }
        onSave(updated);
    }

    useEffect(() => {
        if (category && open) {
            setName(category.name);
            setImageUrl(category.imageUrl || "");
            setDescription(category.description || "");
            setParentCategory(category.parentCategory || null);
        }
        else if(open) {
            setName("");
            setImageUrl("");
            setDescription("");
            setParentCategory(null);
        }
    }, [category, open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-w-90 sm:max-w-120 md:max-w-145">
                <DialogHeader>
                    <DialogDescription className="sr-only">
                        edit category
                    </DialogDescription>
                    <DialogTitle className="text-lg">{isEddit ? category?.name : "Thêm thương hiệu mới"}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm md:text-base">Tên loại</Label>
                        <input 
                            className="input-pro" 
                            placeholder="Nhập tên danh mục..."
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm md:text-base">Ảnh hiển thị</Label>
                        <input 
                            className="input-pro"
                            value={imageUrl}
                            placeholder="https://example.com/logo.png"
                            onChange={(e) => setImageUrl(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm md:text-base">Mô tả</Label>
                        <input
                            className="input-pro h-15"
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="text-sm md:text-base">Danh mục cha</Label>
                        <CategoryCombobox
                            open={comboboxOpen}
                            categories={categories}
                            setOpen={setComboboxOpen}
                            setParentCategory={setParentCategory}
                            defaultParentCategory={parentCategory}
                        />
                    </div>
                </div>

                {formError && (
                  <div className="flex flex-row gap-2">
                    <CircleX color="#f00a0a" strokeWidth={2.5} />
                    <span className="text-sm md:text-base text-red-500">{formError}</span>
                  </div>
                )}

                <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                    Hủy
                </Button>
                <Button 
                    onClick={() => handleSave()} 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    {isEddit ? "Cập nhật" : "Thêm mới"}
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import type { ICategory } from "@/types/category"

interface EditCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: ICategory | null;
  onSave: (updated: ICategory) => void;
}


export function EditCategoryDialog({open, setOpen, category, onSave} : EditCategoryDialogProps){
    const [name, setName] = useState(category?.name || "");
    const [imageUrl, setImageUrl] = useState(category?.imageUrl || "");
    const [description, setDescription] = useState(category?.description || "");

    const handleSave = () => {
        if (!category) return

        onSave({
            ...category,
            name,
            description,
            imageUrl,
        })
        setOpen(false)
    }

    useEffect(() => {
        if (category && open) {
            setName(category.name);
            setImageUrl(category.imageUrl || "");
            setDescription(category.description || "");
        }
    }, [category, open]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-full max-w-90 sm:max-w-120 md:max-w-145">
                <DialogHeader>
                    <DialogDescription className="sr-only">
                        edit category
                    </DialogDescription>
                    <DialogTitle className="text-lg">{name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-sm md:text-base">Tên loại</Label>
                        <Input 
                            className="text-sm md:text-base" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm md:text-base">Ảnh hiển thị</Label>
                        <Input 
                            className="text-sm md:text-base"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)} 
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm md:text-base">Mô tả</Label>
                        <Input 
                            className="text-sm md:text-base"
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                    Hủy
                </Button>
                <Button 
                    onClick={() => handleSave()} 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                    Cập nhật
                </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
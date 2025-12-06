import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
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

    const handleSave = () => {
        if (!category) return

        onSave({
            ...category,
            name,
            imageUrl,
            })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                <DialogTitle>{name}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                <div>
                    <Label>Tên loại</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div>
                    <Label>Ảnh hiển thị</Label>
                    <Input 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)} 
                    />
                </div>
                </div>

                <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                    Hủy
                </Button>
                <Button onClick={handleSave}>Lưu thay đổi</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
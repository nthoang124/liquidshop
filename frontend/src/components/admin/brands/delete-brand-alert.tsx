import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeleteBrandAlertProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  brandName?: string;
  onConfirm: () => void;
}

export function DeleteBrandAlert({ open, setOpen, brandName, onConfirm }: DeleteBrandAlertProps) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className="w-[90%] p-6 max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base md:text-lg">Bạn có chắc muốn xóa {brandName}?</AlertDialogTitle>
          <AlertDialogDescription className="text-[0.95rem]">
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-sm md:text-base">Hủy</AlertDialogCancel>

          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-sm md:base"
            onClick={onConfirm}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

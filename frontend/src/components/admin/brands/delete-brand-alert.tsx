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
          <AlertDialogTitle className="text-lg md:text-xl">Bạn có chắc muốn xóa {brandName}?</AlertDialogTitle>
          <AlertDialogDescription className="text-md md:text-lg">
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-md md:text-xl">Hủy</AlertDialogCancel>

          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600 text-md md:text-xl"
            onClick={onConfirm}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

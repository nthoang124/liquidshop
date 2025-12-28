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

interface UpdateRoleAlertProps {
    role: string | undefined;
    open: boolean;
    setOpen: (open: boolean) => void;
    onConfirm: () => void;
}

export default function UpdateRoleAlert ({role, open, setOpen, onConfirm} : UpdateRoleAlertProps ) {
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="w-[90%] p-6 max-w-sm">
                <AlertDialogHeader>
                <AlertDialogTitle className="text-lg md:text-xl">
                    {role === "customer" && (
                        <p className="text-sm md:text-base font-bold text-black">Xác nhận nâng cấp tài khoản lên Admin</p>
                    )}
                    {role === "admin" && (
                        <p className="text-sm md:text-base font-bold text-black">Xác nhận chuyển tài khoản thành người dùng</p>
                    )}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-md md:text-lg hidden">
                    Hành động này không thể hoàn tác.
                </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                <AlertDialogCancel className="text-sm">Hủy</AlertDialogCancel>

                <AlertDialogAction
                    className="bg-red-500 hover:bg-red-600 text-sm"
                    onClick={onConfirm}
                >
                    OK
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
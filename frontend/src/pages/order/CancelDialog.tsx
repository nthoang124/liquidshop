import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { XCircle, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { orderService } from "@/services/api/customer/order.service";

interface CancelOrderDialogProps {
  orderCode: string;
  onSuccess?: () => void; // Callback để load lại data hoặc cập nhật state
  variant?: "button" | "ghost";
}

const CancelOrderDialog: React.FC<CancelOrderDialogProps> = ({
  orderCode,
  onSuccess,
  variant = "button",
}) => {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    try {
      await orderService.cancelOrder(orderCode);
      toast.success(`Đã hủy đơn hàng #${orderCode} thành công`);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể hủy đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {variant === "button" ? (
          <Button
            variant="outline"
            className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <XCircle className="w-4 h-4 mr-2" /> Hủy đơn hàng
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="text-red-500 hover:bg-red-500/10 hover:text-red-400 h-8 px-3"
          >
            Hủy
          </Button>
        )}
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-[#151517] border-neutral-800 text-white font-sans">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="text-orange-500 w-5 h-5" />
            Xác nhận hủy đơn hàng
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-400">
            Hành động này không thể hoàn tác. Bạn có chắc chắn muốn hủy đơn hàng
            <span className="text-white font-bold ml-1">#{orderCode}</span>{" "}
            không?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="bg-transparent border-neutral-700 text-neutral-400 hover:bg-neutral-800 hover:text-white"
          >
            Quay lại
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleCancel();
            }}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white min-w-[100px]"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Xác nhận hủy"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelOrderDialog;

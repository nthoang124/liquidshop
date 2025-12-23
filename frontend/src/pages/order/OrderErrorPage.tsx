import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { XCircle, RefreshCcw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const OrderErrorPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderCode = searchParams.get("code");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-lg max-w-lg w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
          <XCircle className="w-10 h-10 text-red-600" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-slate-900">
            Thanh toán thất bại
          </h1>
          {orderCode && (
            <p className="text-sm font-mono text-slate-400">
              Mã đơn: #{orderCode}
            </p>
          )}
          <p className="text-slate-500">
            Giao dịch của bạn đã bị hủy hoặc xảy ra lỗi trong quá trình xử lý.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            className="w-full bg-red-600 hover:bg-red-700 h-11"
            // Điều hướng về trang chi tiết đơn hàng để user bấm thanh toán lại
            onClick={() =>
              orderCode ? navigate(`/orders/${orderCode}`) : navigate("/orders")
            }
          >
            <RefreshCcw className="w-4 h-4 mr-2" /> Thử thanh toán lại
          </Button>

          <Button
            variant="ghost"
            className="w-full h-11"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderErrorPage;

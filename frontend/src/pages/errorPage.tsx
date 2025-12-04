import { Link, useRouteError } from "react-router-dom";
import { Home, ArrowLeft, Bug } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";

interface RouteError {
  statusText?: string;
  message?: string;
  [key: string]: any;
}

export default function NotFoundPage() {
  const error = useRouteError() as RouteError;

  console.error(error);

  return (
    <div className="min-h-screen bg-[#151517] flex items-center justify-center p-4 font-sans">
      <Card className="max-w-md w-full bg-slate-50 border border-slate-100 shadow-xl rounded-2xl overflow-hidden">
        <CardHeader className="text-center pb-2 pt-10">
          <div className="space-y-2 relative flex flex-col items-center">
            <h1 className="text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-neutral-900 drop-shadow-sm select-none relative z-10">
              404
            </h1>
            <div className="absolute top-0 right-5 md:right-10 z-10 animate-bounce z-10">
              <Bug className="text-slate-300 w-12 h-12 rotate-12" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-4 px-10 pb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Úi! Trang này không tồn tại.
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            Có vẻ như đường dẫn bạn truy cập bị hỏng hoặc trang đã bị xóa.
            <br />
            {error && (
              <span className="block mt-4 font-mono text-lg bg-slate-200 p-2 rounded text-red-500 overflow-hidden text-ellipsis whitespace-nowrap max-w-full border border-slate-200">
                {error.statusText || error.message}
              </span>
            )}
          </p>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pt-2 pb-10 px-10 border-t border-slate-50">
          <Button
            asChild
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Link to="/" className="flex items-center gap-2">
              <Home size={18} />
              Về trang chủ
            </Link>
          </Button>

          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300 transition-all duration-200"
          >
            <ArrowLeft size={18} className="mr-2" />
            Quay lại
          </Button>
        </CardFooter>

        <div className="bg-slate-50/50 p-4 text-center border-t border-slate-100">
          <p className="text-sm text-slate-400">
            Nếu bạn cho rằng đây là lỗi hệ thống, vui lòng liên hệ hỗ trợ.
          </p>
        </div>
      </Card>
    </div>
  );
}

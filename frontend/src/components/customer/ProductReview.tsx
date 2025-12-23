import React, { useEffect, useState } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { reviewService } from "@/services/api/customer/review.service";

import { formatDate } from "@/utils/formatDateCreatedAt";

interface ProductReviewsProps {
  productId: string;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [userRating, setUserRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // --- LẤY DANH SÁCH REVIEW ---
  useEffect(() => {
    const fetchReviews = async () => {
      if (!productId) return;
      try {
        const res: any = await reviewService.getReviewsByProduct(productId);
        if (res && res.data) {
          setReviews(res.data);
        }
      } catch (error) {
        console.log("Failed to fetch reviews", error);
      }
    };

    fetchReviews();
  }, [productId]);

  // --- GỬI REVIEW ---
  const handleSubmitReview = async () => {
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    if (!token) {
      toast.error("Vui lòng đăng nhập để đánh giá sản phẩm");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nội dung đánh giá");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        productId: productId,
        rating: userRating,
        comment: comment,
      };

      await reviewService.createReview(payload);

      toast.success("Đánh giá đã được gửi và đang chờ duyệt!");

      setComment("");
      setUserRating(5);
    } catch (error: any) {
      console.error("Submit review error", error);
      toast.error(error.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="uppercase border-l-4 border-red-600 pl-3">
          Đánh giá & Nhận xét ({reviews.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* --- FORM VIẾT ĐÁNH GIÁ --- */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">Gửi đánh giá của bạn</h3>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-medium">Chọn mức đánh giá:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= userRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <span className="text-sm font-bold text-yellow-600 ml-2">
              {userRating === 5 ? "Tuyệt vời" : userRating === 1 ? "Tệ" : ""}
            </span>
          </div>

          <div className="space-y-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm này..."
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="flex justify-end">
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* --- DANH SÁCH ĐÁNH GIÁ --- */}
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <Badge variant="secondary" className="italic text-base px-4 py-2">
              Chưa có đánh giá nào
            </Badge>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((rv) => (
              <div
                key={rv._id}
                className="border-b border-gray-100 last:border-0 pb-6"
              >
                {/* REVIEW CỦA USER */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold shrink-0">
                    {rv.userId?.fullName?.charAt(0) || "U"}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-gray-900">
                        {rv.userId?.fullName || "Ẩn danh"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(rv.createdAt)}
                      </span>
                    </div>

                    <div className="flex text-yellow-400 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < rv.rating ? "fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed">
                      {rv.comment}
                    </p>
                  </div>
                </div>

                {/* ADMIN REPLY */}
                {rv.adminReply && (
                  <div className="relative mt-4 ml-12 pl-6">
                    {/* ĐƯỜNG CHỮ L */}
                    <div className="flex items-start gap-3 p-4 border-l-3">
                      {/* AVATAR ADMIN */}
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold shrink-0">
                        A
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-blue-700">
                            Admin
                          </span>

                          {/* VERIFIED ICON */}
                          <BadgeCheck className="w-4 h-4 text-blue-600" />

                          <span className="text-xs text-gray-500">
                            phản hồi {rv.userId?.fullName || "khách hàng"}
                          </span>
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed">
                          {rv.adminReply}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviews;

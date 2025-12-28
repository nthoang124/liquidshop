import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import type { IReview } from "@/types/review";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface ReviewDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  review: IReview | null;
  replyReview: string;
  setReplyReview: (reply: string) => void;
  handleSaveReply: (review: IReview) => void;
  handleApprove: () => void;
  handleReject: () => void;
}

const statusColorMap: Record<IReview["status"], string> = {
  approved: "bg-emerald-500",
  pending: "bg-amber-500",
  rejected: "bg-rose-500",
};

export default function ReviewDetailDialog({
  open,
  onOpenChange,
  review,
  replyReview, 
  setReplyReview,
  handleSaveReply,
  handleApprove,
  handleReject,
}: ReviewDetailDialogProps) {
  if (!review) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
            <DialogDescription className="hidden">
                chi tiết về đánh giá của người dùng
            </DialogDescription>
          <DialogTitle className="flex items-center justify-between">
            <span>Chi tiết đánh giá</span>
            <Badge className={statusColorMap[review.status]}>
              {review.status}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {/* User & Product */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Người đánh giá</p>
            <p className="font-medium">{review.userId.fullName}</p>
            <p className="text-xs text-muted-foreground">
              {review.userId.email}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">Sản phẩm</p>
            <p className="font-bold">{review.productId.name}</p>
          </div>
        </div>

        <Separator />

        {/* Rating */}
        <div>
          <p className="text-muted-foreground text-sm mb-1">Đánh giá</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-medium">
              {review.rating}/5
            </span>
          </div>
        </div>

        {/* Comment */}
        <div>
          <p className="text-muted-foreground text-sm mb-1">Bình luận</p>
          <div className="rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-wrap">
            {review.comment || "Không có nội dung"}
          </div>
        </div>

        {/* Images */}
        {review.images.length > 0 && (
          <div>
            <p className="text-muted-foreground text-sm mb-2">
              Hình ảnh đính kèm
            </p>
            <div className="grid grid-cols-3 gap-2">
              {review.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="review"
                  className="h-24 w-full rounded-md object-cover border"
                />
              ))}
            </div>
          </div>
        )}

        {/* Admin reply */}
          <div>
            <p className="text-muted-foreground text-[0.85rem] md:text-sm mb-1">
                Phản hồi admin
            </p>
            <Textarea
                className="text-[0.85rem] md:text-sm"
                placeholder="Nhập phản hồi của admin..."
                value={replyReview}
                onChange={(e) => setReplyReview(e.target.value)}
                rows={4}
            />
          </div>

        {/* Footer */}
        <div className="text-right text-xs text-muted-foreground">
          Tạo lúc:{" "}
          {new Date(review.createdAt).toLocaleString("vi-VN")}
        </div>

      <DialogFooter className="flex justify-end">
        <div className="flex gap-2">
            {/* Reject */}
            <Button
                variant="destructive"
                onClick={handleReject}
                disabled={!replyReview || !replyReview.trim()}
            >
                Từ chối
            </Button>

            {/* Approve */}
            <Button
            onClick={handleApprove}
            >
                Duyệt
            </Button>
        </div>
        <Button
            className="bg-green-500 hover:bg-green-600 text-white font-bold text-md"
            onClick={() => handleSaveReply(review)}
        >
            Lưu
        </Button>
      </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

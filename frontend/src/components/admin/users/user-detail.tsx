import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mail, Phone, UserRound, MapPin } from "lucide-react"
import type { IUser } from "@/types/user"

interface UserDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: IUser | null;
}

export function UserDetailDialog({ open, onOpenChange, user }: UserDetailDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg md:max-w-2xl w-full rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <UserRound className="w-6 h-6 text-blue-600" />
            Thông tin người dùng
          </DialogTitle>
          <DialogDescription className="text-sm md:text-base">
            Chi tiết hồ sơ của người dùng trong hệ thống.
          </DialogDescription>
        </DialogHeader>

        {/* USER CARD */}
        <div className="flex items-center gap-4 p-4 border rounded-md bg-gray-50">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.avatarUrl} />
            <AvatarFallback className="text-lg">
              {user.fullName?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="text-xl font-semibold">{user.fullName}</p>
            <p className="text-sm text-gray-600 capitalize">
              Vai trò: <span className="font-medium text-gray-800">{user.role}</span>
            </p>
          </div>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <InfoItem icon={<Mail />} label="Email" value={user.email} />
          <InfoItem icon={<Phone />} label="Số điện thoại" value={user.phoneNumber || "—"} />

          <InfoItem
            icon={<MapPin />}
            label="Địa chỉ mặc định"
            value={
              user.addresses?.find((a) => a.isDefault)
                ? `${user.addresses?.find((a) => a.isDefault)?.street}, 
                   ${user.addresses?.find((a) => a.isDefault)?.district}, 
                   ${user.addresses?.find((a) => a.isDefault)?.city}`
                : "Không có địa chỉ"
            }
          />

          <InfoItem
            icon={<UserRound />}
            label="Trạng thái"
            value={user.isActive ? "Đang hoạt động" : "Đã khóa"}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

// COMPONENT NHỎ DÙNG LẠI
function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 border rounded-lg bg-white flex flex-col gap-1 shadow-sm">
      <div className="flex items-center gap-2 text-gray-700 font-medium">
        {icon}
        {label}
      </div>
      <p className="text-gray-900 font-semibold">{value}</p>
    </div>
  )
}

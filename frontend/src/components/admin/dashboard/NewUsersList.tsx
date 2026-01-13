import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Mail } from "lucide-react"
import { RoleBadge } from "../users/role-badege";
import { formatDate } from "@/utils/formatDate";
import { useNavigate } from "react-router-dom";
import type { TopUser } from "@/types/dashboard";

interface NewUserListProps {
    users: TopUser[];
}

export function NewUserList({users} : NewUserListProps) {
  const navigate = useNavigate();
  return (
    <Card className="w-full border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white/70 backdrop-blur-md">
      <CardHeader className="px-4 sm:px-8 pt-6 sm:pt-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg sm:text-xl font-bold tracking-tight">Người dùng mới</CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground/70 font-medium">
              5 thành viên vừa tạo tài khoản 
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-8 pb-6 sm:pb-8 pt-4 sm:pt-6">
        <div className="flex flex-col gap-5 sm:gap-6">
          {users.map((user) => (
            <div
              key={user._id}
              className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-10 w-10 sm:h-11 sm:w-11 border-2 border-white shadow-sm transition-transform group-hover:scale-105 duration-300 flex-shrink-0">
                  <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.fullName} />
                  <AvatarFallback className="bg-slate-100 text-slate-500 font-bold text-xs">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span 
                    onClick={() => navigate(`/admin/users/${user._id}`)}
                    className="font-bold text-slate-900 leading-none group-hover:text-primary transition-colors truncate cursor-pointer text-sm sm:text-base">
                    {user.fullName}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 font-medium truncate">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 pl-[52px] sm:pl-0">
                <div className="flex flex-col items-start sm:items-end gap-1">
                  <RoleBadge role={user.role} className="scale-75 sm:scale-90 origin-left sm:origin-right" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                    {formatDate(user.createdAt || "")}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
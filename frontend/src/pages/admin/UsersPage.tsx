import { DataTable } from "@/components/admin/users/data-table";
import userApi from "@/services/api/admin/userApi";
import type { IUser } from "@/types/user";
import type { UserQuery } from "@/services/api/admin/query";
import { useCallback, useEffect, useState } from "react";
import { Grid2X2 } from "lucide-react";
import PageTitle from "@/components/admin/common/PageTitle";

export default function UsersPage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState("");
    const [totalUsers, setTotalUsers] = useState(0);
    const perPage = 5;

    const loadUsers = useCallback (async () => {
        try {
            const query: UserQuery = {
                page,
                limit: perPage,
                search,
            }
            const res = await userApi.getAll(query);
            setUsers(res.data.data);
            setTotalPages(res.data.totalPages);
            setTotalUsers(res.data.count);
        }
        catch(error){
            console.log(error)
        }   
        finally{
            setIsLoading(false);
        }
    }, [page, perPage, search])

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    return (
        <div className="p-0 md:p-4 bg-white md:bg-transparent">
            {isLoading && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
            )}
            <div className="flex flex-col bg-white gap-3 p-2 md:p-3">
                <PageTitle title="Quản lí khách hàng" subTitle="Quản lí thông tin khách hàng và lịch sử mua hàng"/>
                <div className="border border-gray-200 p-3 shadow-lg rounded-lg mt-10">
                    <p className="flex flex-row gap-2 items-center font-bold text-base">
                        <Grid2X2 size={24} color="#3f6cf3"/>
                        Tổng tài khoản: {totalUsers}
                    </p>
                    <DataTable
                        users={users}
                        setPage={setPage}
                        totalPages={totalPages}
                        page={page}
                        search={search}
                        setSearch={setSearch}
                    />
                </div>
            </div>
             
        </div>
    )
}
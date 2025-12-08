import { DataTable } from "@/components/admin/users/data-table";
import userApi from "@/services/api/admin/userApi";
import type { IUser } from "@/types/user";
import type { UserQuery } from "@/services/api/admin/query";
import { useCallback, useEffect, useState } from "react";

export default function UsersPage() {
    const [users, setUsers] = useState<IUser[]>([])
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(5);  
    const [search, setSearch] = useState("");

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
            setPage(res.data.page);
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
        <div className="p-5">
            {isLoading && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
            )}
            <div className="flex flex-col bg-white shadow-sm gap-3 p-4">
                <div className="flex flex-col bg-white mt-4 px-8 gap-3 border-b border-gray-300 pb-3 pt-3">
                    <p className="text-2xl lg:text-3xl font-bold">Quản lí khách hàng</p>
                    <p className="text-md md:text-lg text-gray-600">Quản lí thông tin khách hàng và lịch sử mua hàng</p>
                </div>
                <div className="border border-gray-200 p-3 shadow-lg rounded-lg">
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
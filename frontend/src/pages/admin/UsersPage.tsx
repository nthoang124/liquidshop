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
            console.log("check get all: ", res.data.data);
            setUsers(res.data.data);
            setTotalPages(res.data.totalPages);
            setPage(res.data.page);
            console.log("check total pages: ", res.data.totalPages)
            console.log("check count: ", res.data.count);
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
        <div className="px-4">
            {isLoading && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Đang tải dữ liệu...</p>
            )}
        
            {!isLoading && users.length === 0 && (
                <p className="text-gray-500 text-center text-md sm:text-lg">Chưa có dữ liệu</p>
            )}
            {!isLoading && users.length > 0 && (
                <div>
                    <DataTable
                        users={users}
                        setPage={setPage}
                        totalPages={totalPages}
                        page={page}
                        search={search}
                        setSearch={setSearch}
                    />
                </div>
            )}
        </div>
    )
}
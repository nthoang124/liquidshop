import { useLocation, useParams } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function format(segment: string) {
  if (!segment) return "";

  if (/^\d+$/.test(segment)) return "Chi tiết";

  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AutoBreadcrumb() {
  const { pathname } = useLocation();
  const {id} = useParams();

  const parts = pathname.split("/").filter(Boolean);
  const segments = parts.slice(1); // bỏ admin 

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((seg, idx) => {
          const isLast = idx === segments.length - 1;

          return (
            <BreadcrumbItem key={idx}>
              {!isLast ? (
                <>
                  <BreadcrumbPage className="text-sm lg:text-base">
                    {format(seg) === id ? "Detail" : format(seg)}
                  </BreadcrumbPage>

                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage className="text-sm lg:text-base">{format(seg) === id ? "detail" : format(seg)}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

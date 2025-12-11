import { useLocation } from "react-router-dom"
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
                  <BreadcrumbPage className="text-md sm:text-lg">
                    {format(seg)}
                  </BreadcrumbPage>

                  <BreadcrumbSeparator />
                </>
              ) : (
                <BreadcrumbPage className="text-md sm:text-lg">{format(seg)}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

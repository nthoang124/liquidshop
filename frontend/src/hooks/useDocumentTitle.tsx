import { useEffect } from "react";

const useDocumentTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} | LIQUIDSHOP`;
  }, [title]);
};

export default useDocumentTitle;

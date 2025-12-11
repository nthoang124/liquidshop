import { useEffect, useState } from "react";

export function useIsLargeScreen() {
  const [isLarge, setIsLarge] = useState(() => window.innerWidth >= 1200); 

  useEffect(() => {
    const handleResize = () => {
      setIsLarge(window.innerWidth >= 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isLarge;
}

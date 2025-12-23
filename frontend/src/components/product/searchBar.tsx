import React, { useState, useEffect, useRef } from "react";
import { productService } from "@/services/api/customer/product.service";
import type { IProduct } from "@/types/product";
import { Link, useNavigate } from "react-router-dom";

import { Search } from "lucide-react";

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    if (debouncedSearchTerm.trim().length > 1) {
      const fetchProducts = async () => {
        setLoading(true);
        try {
          const response = await productService.getProducts({
            keyword: debouncedSearchTerm,
            limit: 5,
          });

          if (response && response.data && response.data.products) {
            setResults(response.data.products);
            setShowDropdown(true);
          }
        } catch (error) {
          console.error("Lỗi tìm kiếm:", error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      };

      fetchProducts();
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      setShowDropdown(false);
      navigate(`/products?keyword=${searchTerm}`);
    }
  };

  const handleSearch = () => {
    setShowDropdown(false);
    navigate(`/products?keyword=${searchTerm}`);
  };

  const getProductLink = (product: IProduct) => {
    const categoryName =
      typeof product.category === "object"
        ? product.category.name
        : String(product.category);

    return `/product/${encodeURIComponent(categoryName)}/${product._id}`;
  };

  return (
    <div className="relative w-full max-w-lg" ref={searchRef}>
      <div className="relative">
        <input
          type="text"
          className="w-full px-4 py-2 bg-white text-black rounded-sm focus:outline-none focus:ring-none pl-3"
          placeholder="Bạn cần tìm gì?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearch}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
        >
          <Search size={20} />
        </button>

        {loading && (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          </span>
        )}
      </div>

      {/* --- DROPDOWN RESULTS --- */}
      {showDropdown && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <ul>
            {results.map((product) => {
              const productLink = getProductLink(product);
              return (
                <li key={product._id} className="border-b last:border-none">
                  <Link
                    to={productLink}
                    className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden mr-3">
                      {product.images ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-gray-500">
                          No Img
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {product.brand?.name} • {product.category?.name}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}

            <li className="p-2 text-center bg-gray-50 cursor-pointer hover:bg-gray-100">
              <span
                className="text-sm text-red-600 font-medium"
                onClick={() => {
                  navigate(`/products?keyword=${searchTerm}`);
                  setShowDropdown(false);
                }}
              >
                Xem tất cả kết quả cho "{searchTerm}"
              </span>
            </li>
          </ul>
        </div>
      )}

      {showDropdown &&
        !loading &&
        searchTerm.length > 1 &&
        results.length === 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500 text-sm">
            Không tìm thấy sản phẩm nào.
          </div>
        )}
    </div>
  );
};

export default SearchBar;

import { Edit, Trash, } from "lucide-react";
import type { ICategory } from "@/types/category";

interface CategoryCardProps {
  category: ICategory;
  handleEdit: (category : ICategory) => void;
  onAskDelete: (category: ICategory) => void;
}

export default function CategoryCard({ category, handleEdit, onAskDelete}: CategoryCardProps) {

  return (
    <div
      className="bg-white h-full rounded-lg shadow-sm border flex flex-col transition overflow-hidden"
    >
      <div className="h-[55%]">
        <img
          src={category.imageUrl || "https://placehold.co/200x200?text=No+Image"}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-2 flex flex-1 flex-row justify-between gap-1 items-center">
        <h3 className="font-medium flex text-sm text-center line-clamp-1">{category.name}</h3>

        <div className="flex">
          <button 
            className="p-1 rounded-full hover:bg-gray-100"
            onClick={() => handleEdit(category)}
          >
            <Edit size={16} />
          </button>

          <button 
            className="p-1 rounded-full hover:bg-red-100 text-red-500"
            onClick={() => onAskDelete(category)}
          >
            <Trash size={16}/>
          </button>

        </div>
      </div>
    </div>
  );
}

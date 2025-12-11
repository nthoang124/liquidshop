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
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer"
    >
      <img
        src={category.imageUrl || "https://placehold.co/200x200?text=No+Image"}
        alt={category.name}
        className="w-full h-36 object-cover rounded-t-xl"
      />

      <div className="p-4 flex justify-between items-center">
        <h3 className="font-semibold text-lg lg:text-xl">{category.name}</h3>

        <div className="flex gap-2">
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => handleEdit(category)}
          >
            <Edit size={20} />
          </button>

          <button 
            className="p-2 rounded-full hover:bg-red-100 text-red-500"
            onClick={() => onAskDelete(category)}
          >
            <Trash size={20}/>
          </button>

        </div>
      </div>
    </div>
  );
}

import { Edit, Trash } from "lucide-react";
import type { ICategory } from "@/types/category";

interface CategoryCardProps {
  category: ICategory;
  handleEdit: (category : ICategory) => void
}

export default function CategoryCard({ category, handleEdit }: CategoryCardProps) {

  return (
    <div
      className="bg-white rounded-xl shadow-sm border hover:shadow-md transition cursor-pointer"
    >
      <img
        src={category.imageUrl}
        alt={category.name}
        className="w-full h-36 object-cover rounded-t-xl"
      />

      <div className="p-4 flex justify-between items-center">
        <h3 className="font-semibold text-lg">{category.name}</h3>

        <div className="flex gap-2">
          <button 
            className="p-2 rounded-full hover:bg-gray-100"
            onClick={() => handleEdit(category)}
            >
            <Edit size={19} />
          </button>

          <button className="p-2 rounded-full hover:bg-red-100 text-red-500">
            <Trash size={19} />
          </button>

        </div>
      </div>
    </div>
  );
}

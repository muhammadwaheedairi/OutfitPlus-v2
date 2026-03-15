"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function CategoryFilter({
  categories = [],
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryClick = (category: string) => {
    if (category === "All") {
      setSelectedCategories([]);
      onSelectCategory("All");
      return;
    }

    let newSelectedCategories: string[];
    if (selectedCategories.includes(category)) {
      newSelectedCategories = selectedCategories.filter((c) => c !== category);
    } else {
      newSelectedCategories = [...selectedCategories, category];
    }

    setSelectedCategories(newSelectedCategories);
    if (newSelectedCategories.length === 0) {
      onSelectCategory("All");
    } else {
      onSelectCategory(newSelectedCategories.join(","));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4">
        <button
          onClick={() => handleCategoryClick("All")}
          className={`w-full md:w-auto mb-2 md:mb-0 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium border transition-colors ${
            activeCategory === "All"
              ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-700"
              : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
          }`}
        >
          All Products
          {activeCategory === "All" && <Check className="ml-2 h-4 w-4" />}
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {categories
          .filter((cat) => cat !== "All")
          .map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`inline-flex items-center justify-between rounded-md px-4 py-2 text-sm font-medium border transition-colors ${
                selectedCategories.includes(category)
                  ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-700"
                  : "bg-white text-gray-900 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {category}
              {selectedCategories.includes(category) && (
                <Check className="ml-2 h-4 w-4" />
              )}
            </button>
          ))}
      </div>
    </div>
  );
}
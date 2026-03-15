"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const MIN = 0;
const MAX = 1000;

export default function PriceRangeSlider() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [minVal, setMinVal] = useState(Number(searchParams.get("minPrice") ?? MIN));
  const [maxVal, setMaxVal] = useState(Number(searchParams.get("maxPrice") ?? MAX));

  const applyFilter = (min: number, max: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min === MIN) params.delete("minPrice");
    else params.set("minPrice", String(min));
    if (max === MAX) params.delete("maxPrice");
    else params.set("maxPrice", String(max));
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between text-sm text-gray-600 mb-3">
        <span>${minVal}</span>
        <span>${maxVal}</span>
      </div>

      {/* Min slider */}
      <div className="relative mb-2">
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={10}
          value={minVal}
          onChange={(e) => {
            const val = Math.min(Number(e.target.value), maxVal - 10);
            setMinVal(val);
            applyFilter(val, maxVal);
          }}
          className="w-full h-1 appearance-none bg-gray-200 rounded outline-none cursor-pointer accent-gray-900"
        />
      </div>

      {/* Max slider */}
      <div className="relative">
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={10}
          value={maxVal}
          onChange={(e) => {
            const val = Math.max(Number(e.target.value), minVal + 10);
            setMaxVal(val);
            applyFilter(minVal, val);
          }}
          className="w-full h-1 appearance-none bg-gray-200 rounded outline-none cursor-pointer accent-gray-900"
        />
      </div>
    </div>
  );
}
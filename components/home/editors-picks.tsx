import Image from "next/image";
import Link from "next/link";
import React from "react";

const EditorsPicks = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center mt-16 mb-7 bg-[#FAFAFA] pt-3">
      {/* Section Heading */}
      <div>
        <h2 className="text-[#252B42] font-bold text-[24px] mb-2">
        TOP PICKS FOR YOU
        </h2>
        <p className="text-[#737373] text-[14px]">
        Handpicked styles to elevate your wardrobe.
        </p>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex justify-center items-start gap-6 mt-6">
        {/* Men Image with Label */}
        <Link href="/product?category=Men's+Wear" className="relative">
          <Image src={"/men.png"} alt="Men's Fashion" width={340} height={300} />
          <div className="absolute bottom-4 left-4 w-[170px] h-[48px] bg-white flex items-center justify-center">
            <span className="text-[#252B42] font-bold text-lg">MEN</span>
          </div>
        </Link>

        {/* Women Image with Label */}
        <Link href="/product?category=Women's+Wear" className="relative">
          <Image src={"/women.jpg"} alt="Women's Fashion" width={340} height={300} />
          <div className="absolute bottom-4 left-4 w-[170px] h-[48px] bg-white flex items-center justify-center">
            <span className="text-[#252B42] font-bold text-lg">WOMEN</span>
          </div>
        </Link>

        {/* Accessories and Kids Section */}
        <div className="flex flex-col gap-6">
          {/* Accessories Image with Label */}
          <Link href="/product?category=Accessories" className="relative">
            <Image src={"/accessories.jpg"} alt="Fashion Accessories" width={242} height={242} />
            <div className="absolute bottom-4 left-4 w-[170px] h-[48px] bg-white flex items-center justify-center">
              <span className="text-[#252B42] font-bold text-lg">ACCESSORIES</span>
            </div>
          </Link>

          {/* Kids Image with Label */}
          <Link href="/product?category=Kid's+Wear" className="relative">
            <Image src={"/kids.jpg"} alt="Kids' Fashion" width={242} height={242} />
            <div className="absolute bottom-4 left-4 w-[170px] h-[48px] bg-white flex items-center justify-center">
              <span className="text-[#252B42] font-bold text-lg">KIDS</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden flex flex-col items-center justify-center gap-6 mt-6">
        {/* Men Image with Label */}
        <Link href="/product?category=Men's+Wear" className="relative w-[90%]">
          <Image src={"/men.png"} alt="Men's Fashion" width={300} height={300} />
          <div className="absolute bottom-4 left-4 w-[170px] h-[48px] bg-white flex items-center justify-center">
            <span className="text-[#252B42] font-bold text-lg">MEN</span>
          </div>
        </Link>

        {/* Women Image with Label */}
        <Link href="/product?category=Women's+Wear" className="relative w-[90%]">
          <Image src={"/women.jpg"} alt="Women's Fashion" width={270} height={500} />
          <div className="absolute bottom-4 left-4 w-[170px] h-[48px] bg-white flex items-center justify-center">
            <span className="text-[#252B42] font-bold text-lg">WOMEN</span>
          </div>
        </Link>

        {/* Accessories and Kids Section */}
        <div className="flex flex-col gap-6 w-[90%]">
          {/* Accessories Image with Label */}
          <Link href="/product?category=Accessories" className="relative">
            <Image src={"/accessories.jpg"} alt="Fashion Accessories" width={270} height={242} />
            <div className="absolute bottom-4 left-4 w-[170px] h-[48px] bg-white flex items-center justify-center">
              <span className="text-[#252B42] font-bold text-lg">ACCESSORIES</span>
            </div>
          </Link>

          {/* Kids Image with Label */}
          <Link href="/product?category=Kid's+Wear" className="relative">
            <Image src={"/kids.jpg"} alt="Kids' Fashion" width={270} height={242} />
            <div className="absolute bottom-4 left-4 w-[170px] h-[48px] bg-white flex items-center justify-center">
              <span className="text-[#252B42] font-bold text-lg">KIDS</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditorsPicks;
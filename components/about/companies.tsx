import Image from "next/image";

const Companies = () => {
  return (
    <div className="bg-[#FAFAFA] mt-10 py-11">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-[40px] font-bold text-[#252B42]">
          Trusted by Leading Brands
        </h1>
        <p className="text-[#737373] text-[14px] mt-3">
          We partner with the best to bring you quality you can trust.
        </p>
        <p className="text-[#737373] text-[14px] mt-3">
          Our network of top brands ensures every piece meets our standard.
        </p>
      </div>
      <div className="mt-12 flex justify-center items-center">
        <Image
          src="/companies.png"
          alt="Our brand partners"
          width={1054}
          height={175}
        />
      </div>
    </div>
  );
};

export default Companies;
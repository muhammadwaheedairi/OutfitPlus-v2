import Image from "next/image";

const Stats = () => {
  return (
    <div className="flex flex-col items-center mt-11 px-6">
      <div className="flex flex-col sm:flex-row w-full items-start gap-6 py-8 mx-4 sm:mx-20">
        <div>
          <h3 className="text-[#E74040] text-[14px] mb-8">Why OutfitPlus</h3>
          <h2 className="font-bold text-[24px] text-[#252B42] sm:mt-2">
            Fashion that empowers, <br /> style that speaks, <br /> quality that lasts.
          </h2>
        </div>
        <p className="text-[#737373] text-[14px] sm:mt-16 mt-8 sm:mx-20 mx-4">
          We believe great style shouldn't be a luxury. <br />
          OutfitPlus makes premium fashion accessible to everyone.
        </p>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-32 mt-16 mx-6 sm:mx-24">
        <div className="text-center">
          <h3 className="font-bold text-[#252B42] text-[48px] sm:text-[58px]">15K</h3>
          <h2 className="font-bold text-[#737373] text-[14px] sm:text-[16px]">Happy Customers</h2>
        </div>
        <div className="text-center">
          <h3 className="font-bold text-[#252B42] text-[48px] sm:text-[58px]">150K</h3>
          <h2 className="font-bold text-[#737373] text-[14px] sm:text-[16px]">Monthly Visitors</h2>
        </div>
        <div className="text-center">
          <h3 className="font-bold text-[#252B42] text-[48px] sm:text-[58px]">50+</h3>
          <h2 className="font-bold text-[#737373] text-[14px] sm:text-[16px]">Brands Available</h2>
        </div>
        <div className="text-center">
          <h3 className="font-bold text-[#252B42] text-[48px] sm:text-[58px]">4.9★</h3>
          <h2 className="font-bold text-[#737373] text-[14px] sm:text-[16px]">Average Rating</h2>
        </div>
      </div>

      <div className="mt-16 sm:mt-20 flex justify-center items-center mx-6 sm:mx-36">
        <Image src="/problem.png" alt="Our process" width={989} height={540} />
      </div>
    </div>
  );
};

export default Stats;
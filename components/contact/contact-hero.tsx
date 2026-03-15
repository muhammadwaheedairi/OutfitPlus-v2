import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const ContactHero = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between px-4 py-8">
      {/* Text Section */}
      <div className="w-full text-center md:text-left md:w-1/2 md:ml-16">
        <h3 className="text-[#252B42] font-bold text-[16px] sm:text-[18px] md:text-[20px] mb-6">
          CONTACT US
        </h3>
        <h1 className="text-[#252B42] font-bold text-[32px] sm:text-[40px] md:text-[48px] mb-6">
          We'd love to <br />
          hear from you!
        </h1>
        <p className="text-[#737373] text-[16px] sm:text-[18px] md:text-[20px] mt-5">
          Have a question about your order, sizing, or returns? <br />
          Our support team is ready to help you.
        </p>

        {/* Phone and Email Section */}
        <div className="text-[#252B42] font-bold text-[18px] sm:text-[20px] md:text-[24px] mt-8">
          <h3>Phone: +92 323 829 3672</h3>
          <h3 className="mt-5">Email: support@outfitplus.com</h3>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center md:justify-start gap-6 mt-8">
          <Link href="https://twitter.com/outfitplus" target="_blank" rel="noopener noreferrer"
            className="text-[#252B42] hover:text-blue-500 text-[24px] sm:text-[27px]">
            <FaTwitter />
          </Link>
          <Link href="https://facebook.com/outfitplus" target="_blank" rel="noopener noreferrer"
            className="text-[#252B42] hover:text-blue-700 text-[24px] sm:text-[27px]">
            <FaFacebook />
          </Link>
          <Link href="https://instagram.com/outfitplus" target="_blank" rel="noopener noreferrer"
            className="text-[#252B42] hover:text-pink-500 text-[24px] sm:text-[27px]">
            <FaInstagram />
          </Link>
          <Link href="https://linkedin.com/company/outfitplus" target="_blank" rel="noopener noreferrer"
            className="text-[#252B42] hover:text-blue-600 text-[24px] sm:text-[27px]">
            <FaLinkedin />
          </Link>
        </div>
      </div>

      {/* Image Section */}
      <div className="w-full md:w-1/2 mt-8 md:mt-0">
        <Image
          src="/contactus.png"
          alt="Contact Us"
          height={280}
          width={415}
          className="w-full h-auto object-contain"
        />
      </div>
    </div>
  );
};

export default ContactHero;
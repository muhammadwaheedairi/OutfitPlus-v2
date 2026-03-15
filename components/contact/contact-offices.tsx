import { FiPhone, FiMapPin, FiMail, FiArrowDown } from "react-icons/fi";
import Link from "next/link";

const cards = [
  {
    icon: <FiPhone className="text-[#23A6F0] text-[48px] w-[72px] h-[72px]" />,
    title1: "+92 323 829 3672",
    title2: "Mon–Sat, 10am–6pm",
    description: "Call Us",
    button: "Call Now",
    href: "tel:+923238293672",
  },
  {
    icon: <FiMapPin className="text-[#23A6F0] text-[48px] w-[72px] h-[72px]" />,
    title1: "Karachi, Pakistan",
    title2: "Nationwide Delivery",
    description: "Find Us",
    button: "View on Map",
    href: "https://www.google.com/maps/place/Karachi,+Karachi+City,+Sindh,+Pakistan",
  },
  {
    icon: <FiMail className="text-[#23A6F0] text-[48px] w-[72px] h-[72px]" />,
    title1: "muhammadwaheedairi@gmail.com",
    title2: "We reply within 24 hours",
    description: "Email Us",
    button: "Send Email",
    href: "https://mail.google.com/mail/?view=cm&to=muhammadwaheedairi@gmail.com",
  },
];

const ContactOffices = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-10 px-4">
      <div className="mb-10">
        <h3 className="text-[#252B42] font-bold text-[14px] mb-4">
          HOW TO REACH US
        </h3>
        <h2 className="text-[#252B42] font-bold text-[40px]">
          Style advice, order help, <br />
          or just a quick hello
        </h2>
      </div>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${
              index === 1
                ? "bg-[#252B42] text-white h-[400px]"
                : "bg-white text-[#252B42]"
            } shadow-md rounded-lg p-6 max-w-sm text-center`}
          >
            <div className="flex justify-center items-center mb-4">
              {card.icon}
            </div>
            <p className="font-bold text-[16px]">{card.title1}</p>
            <p className="font-bold text-[16px] mb-4">{card.title2}</p>
            <p className="font-bold text-[18px] mb-6">{card.description}</p>
            <Link
              href={card.href}
              target={card.href.startsWith("http") ? "_blank" : undefined}
              rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="bg-transparent border border-[#23A6F0] text-[#23A6F0] hover:bg-[#23A6F0] hover:text-white font-bold py-4 px-6 rounded-full transition"
            >
              {card.button}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-16 py-10 text-center">
        <div className="flex justify-center items-center">
          <FiArrowDown className="text-[#23A6F0] text-[48px] transform -rotate-45" />
        </div>
        <h3 className="text-[#252B42] font-bold text-[16px] mt-4">
          YOUR STYLE, OUR PRIORITY
        </h3>
        <h2 className="text-[#252B42] font-bold text-[58px] mt-3">
          Let&apos;s Talk Fashion
        </h2>
        <Link
          href="https://wa.me/923180297567"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#25D366] text-white px-8 py-4 rounded-md m-4 hover:bg-[#1ebe5d] transition-colors font-bold"
        >
          Message on WhatsApp
        </Link>
      </div>
    </div>
  );
};

export default ContactOffices;
import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

interface TeamMember {
  name: string;
  profession: string;
  social: { facebook: string; instagram: string; twitter: string };
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Alex Carter",
    profession: "Creative Director",
    social: { facebook: "#", instagram: "#", twitter: "#" },
    image: "/team-member3.png",
  },
  {
    name: "Emma Davis",
    profession: "Head of Styling",
    social: { facebook: "#", instagram: "#", twitter: "#" },
    image: "/team-member4.png",
  },
  {
    name: "Noah Bennett",
    profession: "Brand Strategist",
    social: { facebook: "#", instagram: "#", twitter: "#" },
    image: "/team-member1.png",
  },
];

const Team = () => {
  return (
    <section className="py-16 bg-white">
      <h2 className="text-center text-[40px] font-bold mb-20 text-[#252B42]">
        The People Behind OutfitPlus
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 px-4">
        {teamMembers.map((member, index) => (
          <div key={index} className="text-center">
            <Image
              src={member.image}
              alt={member.name}
              width={316}
              height={231}
              className="mx-auto"
            />
            <h3 className="mt-6 text-[16px] font-bold text-[#252B42]">
              {member.name}
            </h3>
            <p className="text-[#737373] text-[14px] mt-3">{member.profession}</p>
            <div className="flex justify-center mt-3 space-x-4">
              <Link href={member.social.facebook} className="text-[#23A6F0]">
                <FaFacebookF size={25} />
              </Link>
              <Link href={member.social.instagram} className="text-[#23A6F0]">
                <FaInstagram size={25} />
              </Link>
              <Link href={member.social.twitter} className="text-[#23A6F0]">
                <FaTwitter size={25} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Team;
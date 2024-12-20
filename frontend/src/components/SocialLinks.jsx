import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaTiktok, FaYoutube } from "react-icons/fa";

const SocialLinks = ({ theme }) => {
    const baseTextColor = theme === 'light' ? 'text-white' : 'text-gray-800';
    
    const socialLinks = [
        {
            href: "https://www.facebook.com/deninedenined/",
            icon: FaFacebook,
            hoverColor: "hover:text-blue-600"
        },
        {
            href: "https://x.com/denividan",
            icon: FaTwitter,
            hoverColor: "hover:text-blue-400"
        },
        {
            href: "https://instagram.com/denividan/",
            icon: FaInstagram,
            hoverColor: "hover:text-pink-600"
        },
        {
            href: "https://www.linkedin.com/in/denividan/",
            icon: FaLinkedin,
            hoverColor: "hover:text-blue-400"
        },
        {
            href: "https://www.tiktok.com/@denividan",
            icon: FaTiktok,
            hoverColor: "hover:text-pink-500"
        },
        {
            href: "https://www.youtube.com/@denividan",
            icon: FaYoutube,
            hoverColor: "hover:text-red-600"
        }
    ];

    return (
        <div className="social-icons flex gap-7">
            {socialLinks.map((link, index) => {
                const Icon = link.icon;
                return (
                    <a
                        key={index}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${baseTextColor} ${link.hoverColor}`}
                        style={{ opacity: 0.5 }}
                    >
                        <Icon className="text-2xl" />
                    </a>
                );
            })}
        </div>
    );
};

export default SocialLinks;
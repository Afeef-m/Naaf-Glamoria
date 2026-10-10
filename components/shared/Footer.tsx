//Naaf-Glamoria\components\shared\Footer.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { name: "New Arrivals", href: "/shop" },
      { name: "Best Sellers", href: "/best-sellers" },
      { name: "Engagement Rings", href: "/rings" },
    ],
    support: [
      { name: "Shipping & Returns", href: "/shipping" },
      { name: "Care Guide", href: "/care" },
      { name: "Contact Us", href: "/contact" },
    ],
    legal: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ]
  };

  const socialLinks = [
    { name: "WhatsApp", 
      href: "https://wa.me/919746072294?text=Hi%20Naaf%20Glamoria,%20I%E2%80%99m%20interested%20in%20your%20unique%20jewelry%20collection.%20Could%20you%20help%20me%20find%20the%20perfect%20piece?",
      icon: <WhatsAppIcon /> },
    { name: "Instagram", href: "https://www.instagram.com/naaf.glamoria/", icon: <InstagramIcon /> },
    { name: "LinkedIn", href: "#", icon: <LinkedInIcon /> },
    { name: "X", href: "#", icon: <XIcon /> },
  ];

  return (
    <footer>
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Philosophy */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-[#154415] font-bold mb-4 uppercase tracking-widest text-sm">Our Philosophy</h3>
            <p className="text-[#154415]/70 text-sm leading-relaxed">
              Crafting timeless elegance through unique jewelry pieces that tell your story. Designed for the modern visionary.
            </p>
          </div>

          {/* Dynamic Links */}
          <div className="grid grid-cols-2 gap-8 col-span-1 md:col-span-2">
             <div>
               <h3 className="text-[#154415] font-bold mb-4 uppercase tracking-widest text-sm">Collection</h3>
               <ul className="space-y-2">
                 {footerLinks.shop.map(link => (
                   <li key={link.name}><Link href={link.href} className={styles.navLink}>{link.name}</Link></li>
                 ))}
               </ul>
             </div>
             <div>
               <h3 className="text-[#154415] font-bold mb-4 uppercase tracking-widest text-sm">Experience</h3>
               <ul className="space-y-2">
                 {footerLinks.support.map(link => (
                   <li key={link.name}><Link href={link.href} className={styles.navLink}>{link.name}</Link></li>
                 ))}
               </ul>
             </div>
          </div>

          {/* Socials & Connectivity */}
          <div className="flex flex-col items-start md:items-end">
            <h3 className="text-[#154415] font-bold mb-4 uppercase tracking-widest text-sm">Connect</h3>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  className={styles.socialIcon}
                  whileHover={{ y: -3, color: "#a8856e" }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Big Brand Mark Centerpiece */}
        <div className="border-t border-[#154415]/10 pt-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={styles.brandText}
          >
            NAAF GLAMORIA
          </motion.h1>
          
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[#154415]/50 text-xs uppercase tracking-tighter">
            <p>&copy; {currentYear} Naaf Glamoria. Handcrafted in India.</p>
            <div className="flex gap-6">
              {footerLinks.legal.map(link => (
                <Link key={link.name} href={link.href} className="hover:text-[#154415] transition-colors">{link.name}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Icon Components (Keeping code clean)
const WhatsAppIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /></svg>
);
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
);
const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
);
const XIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.429l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
);




// "use client";

// import { motion } from "framer-motion";
// import styles from "./Footer.module.css";

// export function Footer() {
//   const currentYear = new Date().getFullYear();

//   const socialLinks = [
//     {
//       name: "WhatsApp",
//       href: "https://wa.me/919746072294?text=Hi%20Naaf%20Glamoria,%20I%E2%80%99m%20interested%20in%20your%20unique%20jewelry%20collection.%20Could%20you%20help%20me%20find%20the%20perfect%20piece?",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
//         </svg>
//       ),
//     },
//     {
//       name: "Instagram",
//       href: "https://www.instagram.com/naaf.glamoria/",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
//           <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
//           <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
//         </svg>
//       ),
//     },
//     {
//       name: "LinkedIn",
//       href: "#",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
//           <rect width="4" height="12" x="2" y="9" />
//           <circle cx="4" cy="4" r="2" />
//         </svg>
//       ),
//     },
//     {
//       name: "X",
//       href: "#",
//       icon: (
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="20"
//           height="20"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="2"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M4 4l11.733 16h4.429l-11.733 -16z" />
//           <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
//         </svg>
//       ),
//     },
//   ];

//   return (
//     <footer className="w-full py-8 px-4 z-20 relative">
//       <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center md:justify-between items-center gap-6">
//         {/* Copyright */}
//         <p className="text-[#154415] text-sm md:text-base font-librecaslon tracking-wide text-center md:text-left order-2 md:order-1">
//           &copy; {currentYear} Naaf Glamoria. All rights reserved.
//         </p>

//         <div className="text-center">
//           <h1 className={styles.brandText}>
//             NAAF <br /> GLAMORIA
//           </h1>
//         </div>

//         {/* Social Icons */}
//         <div className="flex items-center gap-6 order-1 md:order-2">
//           {socialLinks.map((social) => (
//             <motion.a
//               key={social.name}
//               href={social.href}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="text-[#154415] hover:text-[#a8856e] transition-colors p-2"
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               aria-label={social.name}
//             >
//               {social.icon}
//             </motion.a>
//           ))}
//         </div>
//       </div>
//     </footer>
//   );
// }

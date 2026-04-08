import { Link } from "react-router";
import { Home, Mail, Phone, MapPin,} from "lucide-react";
import { FaInstagram, FaTwitter, FaLinkedinIn, FaFacebookF } from 'react-icons/fa';

export function Footer() {
  return (
    <footer style={{ background: "linear-gradient(135deg, #111829 0%, #1B2B5E 100%)", color: "white" }}>
      <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <div
                style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)" }}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
              >
                <Home size={17} color="white" />
              </div>
              <span style={{ letterSpacing: "-0.5px" }} className="text-xl font-semibold">Habitta</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "14px", lineHeight: "1.7" }}>
              The premium property marketplace connecting people with their dream homes across France and Europe.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: <FaInstagram size={16} />, href: "#" },
                { icon: <FaTwitter size={16} />, href: "#" },
                { icon: <FaLinkedinIn size={16} />, href: "#" },
                { icon: <FaFacebookF size={16} />, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-[rgba(255,255,255,0.2)]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", letterSpacing: "0.08em" }} className="uppercase font-semibold mb-5">
              Explore
            </p>
            <ul className="space-y-3">
              {[
                { label: "Properties for Sale", path: "/search?type=sale" },
                { label: "Properties for Rent", path: "/search?type=rent" },
                { label: "New Developments", path: "/search" },
                { label: "Featured Properties", path: "/search?featured=true" },
                { label: "AI Furnishing", path: "/" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}
                    className="transition-all hover:text-white hover:opacity-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", letterSpacing: "0.08em" }} className="uppercase font-semibold mb-5">
              Company
            </p>
            <ul className="space-y-3">
              {[
                "About Habitta",
                "Our Agents",
                "Careers",
                "Press & Media",
                "Blog",
                "Privacy Policy",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}
                    className="transition-all hover:text-white"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px", letterSpacing: "0.08em" }} className="uppercase font-semibold mb-5">
              Contact
            </p>
            <ul className="space-y-4">
              {[
                { icon: <MapPin size={15} />, text: "12 Avenue des Champs-Élysées, Paris 75008" },
                { icon: <Mail size={15} />, text: "hello@habitta.com" },
                { icon: <Phone size={15} />, text: "+33 1 23 45 67 89" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span style={{ color: "#C9A96E", marginTop: "2px" }}>{item.icon}</span>
                  <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", lineHeight: "1.5" }}>{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }} className="mb-3 font-medium">Stay updated</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "white",
                    fontSize: "13px",
                  }}
                  className="flex-1 px-3 py-2 rounded-xl outline-none placeholder:text-[rgba(255,255,255,0.3)] focus:border-[rgba(201,169,110,0.5)]"
                />
                <button
                  style={{ background: "linear-gradient(135deg, #C9A96E, #B8924A)", color: "white", fontSize: "13px" }}
                  className="px-4 py-2 rounded-xl font-medium transition-all hover:opacity-90 shrink-0"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}>
            © 2026 Habitta. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {["Terms of Service", "Privacy Policy", "Cookie Policy"].map((item) => (
              <a
                key={item}
                href="#"
                style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px" }}
                className="hover:text-white transition-all"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

import Image from "next/image";
import { siteConfig } from "@/config/site";

interface FooterProps {
  companyName?: string;
  companySlogan?: string;
  location?: string;
  phone?: string;
  logo?: string;
}

export default function Footer({
  companyName = siteConfig.company,
  companySlogan = siteConfig.slogan,
  location = siteConfig.location,
  phone = siteConfig.phone,
  logo = "/logo.png",
}: FooterProps) {
  return (
    <footer className="bg-[#0A3A5F] text-white py-10 mt-auto">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-6 px-6">
        {/* Logo + Empresa */}
        <div className="flex items-center gap-3">
          <Image
            src={logo}
            alt={`${companyName} Logo`}
            width={120}
            height={40}
            className="object-contain"
          />
          <div>
            <p className="font-bold">{companyName}</p>
            <p className="text-sm text-gray-200">{companySlogan}</p>
          </div>
        </div>

        {/* Contacto */}
        <div className="text-sm text-gray-200 text-right">
          <p>
            {location} · Tel: {phone}
          </p>
          <p>© 2025 {companyName}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

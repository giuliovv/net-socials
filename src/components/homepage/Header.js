import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="p-4 flex items-center justify-center md:justify-start fixed top-0 left-0 w-full z-50 bg-black">
      <Link href="/"className="relative w-40 h-20 md:w-32 md:h-24">
        <Image 
          src="/images/logo-white.png" 
          alt="NET SOCIAL Logo" 
          fill
          style={{objectFit: "contain"}}
        />
      </Link>
    </header>
  );
}

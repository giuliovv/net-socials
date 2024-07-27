'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const DesktopLayout = dynamic(() => import('../components/homepage/DesktopLayout'), { ssr: false });
const MobileLayout = dynamic(() => import('../components/homepage/MobileLayout'), { ssr: false });

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <>
      {isMobile ? <MobileLayout /> : <DesktopLayout />}
    </>
  );
}
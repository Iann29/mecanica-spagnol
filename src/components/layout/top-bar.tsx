'use client';

import { MapPin, Phone } from 'lucide-react';

export function TopBar() {
  return (
    <div className="w-full bg-[#0252A7] text-white py-2 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Truck emoji - left side */}
        <div className="absolute left-4 md:left-20 -top-4 text-[40px] sm:text-[60px] md:text-[80px] opacity-[0.22] rotate-12 grayscale">
          🚛
        </div>
        
        {/* Gear emoji - left center */}
        <div className="absolute left-32 sm:left-48 md:left-64 -bottom-6 text-[30px] sm:text-[45px] md:text-[60px] opacity-[0.22] -rotate-12 grayscale hidden sm:block">
          ⚙️
        </div>
        
        {/* Wrench emoji - right side */}
        <div className="absolute right-2 md:right-20 -top-6 text-[35px] sm:text-[50px] md:text-[70px] opacity-[0.22] -rotate-6 grayscale">
          🔧
        </div>
        
        {/* Tools emoji - right center */}
        <div className="absolute right-32 sm:right-52 md:right-64 -bottom-8 text-[35px] sm:text-[50px] md:text-[65px] opacity-[0.22] rotate-45 grayscale hidden sm:block">
          🛠️
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-3 sm:px-4 relative z-10">
        {/* Mobile - apenas telefone */}
        <div className="flex items-center justify-center gap-1 sm:hidden">
          <Phone className="h-3 w-3" />
          <a href="tel:+555433441455" className="hover:underline font-medium">(54) 3344-1455</a>
        </div>
        
        {/* Desktop - conteúdo completo */}
        <div className="hidden sm:flex items-center justify-center text-sm gap-6 md:gap-16">
          <span className="font-medium">A mais ampla seção de peças da região</span>
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>Av. Dom Pedro II, 120, Centro, Tapejara/RS</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3" />
            <a href="tel:+555433441455" className="hover:underline">(54) 3344-1455</a>
          </div>
        </div>
      </div>
    </div>
  );
}
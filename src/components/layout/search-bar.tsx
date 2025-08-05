'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function SearchBar() {
  return (
    <form className="relative flex items-center w-full min-w-0 sm:min-w-[400px]">
      <Input
        type="search"
        placeholder="Buscar peças..."
        className="w-full pl-10 pr-10 sm:pr-12 h-12 sm:h-11 text-base sm:text-sm focus-visible:ring-0 focus-visible:ring-offset-0 hover:border-border"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
      <button
        type="submit"
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#0252A7] transition-colors hidden sm:block"
      >
        <Search className="h-5 w-5" />
        <span className="sr-only">Buscar</span>
      </button>
    </form>
  );
}
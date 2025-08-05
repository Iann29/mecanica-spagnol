import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/lib/config/site';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#101010] text-white">
      <div>
        {/* Top accent */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#0252A7] to-transparent"></div>
        
        <div className="container mx-auto px-4 pt-12 pb-6">
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            {/* Company Info - Spans 4 columns */}
            <div className="lg:col-span-4">
              <div className="mb-6">
                <Image
                  src="/images/logo-spagnol.png"
                  alt="Spagnol Mecânica Agrícola"
                  width={200}
                  height={70}
                  className="h-16 w-auto brightness-0 invert opacity-90"
                />
              </div>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Há mais de 50 anos no mercado, somos referência em mecânica pesada, 
                peças e serviços para linha diesel leve e pesada.
              </p>
              
              {/* Social Media */}
              <div className="flex gap-4">
                <a 
                  href={siteConfig.social.instagram} 
                  className="group"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <svg className="w-7 h-7 fill-gray-500 group-hover:fill-[#E4405F] transition-colors duration-300" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
                  </svg>
                </a>
                <a 
                  href={siteConfig.social.whatsapp} 
                  className="group"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <svg className="w-7 h-7 fill-gray-500 group-hover:fill-[#25D366] transition-colors duration-300" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
                <a 
                  href={siteConfig.social.facebook} 
                  className="group"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <svg className="w-7 h-7 fill-gray-500 group-hover:fill-[#1877F2] transition-colors duration-300" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a 
                  href="https://youtube.com/@mecanicaspagnol" 
                  className="group"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <svg className="w-7 h-7 fill-gray-500 group-hover:fill-[#FF0000] transition-colors duration-300" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links - Spans 2 columns */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Acesso Rápido</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/sobre" className="text-gray-400 hover:text-[#0252A7] transition-colors text-sm flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/servicos" className="text-gray-400 hover:text-[#0252A7] transition-colors text-sm flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Serviços
                  </Link>
                </li>
                <li>
                  <Link href="/produtos" className="text-gray-400 hover:text-[#0252A7] transition-colors text-sm flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Produtos
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="text-gray-400 hover:text-[#0252A7] transition-colors text-sm flex items-center gap-1 group">
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Contato
                  </Link>
                </li>
              </ul>
            </div>

            {/* Categories - Spans 2 columns */}
            <div className="lg:col-span-2">
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Categorias</h4>
              <ul className="space-y-3">
                <li>
                  <Link href="/categoria/caminhonetes-a-diesel" className="text-gray-400 hover:text-[#0252A7] transition-colors text-sm">
                    Caminhonetes
                  </Link>
                </li>
                <li>
                  <Link href="/categoria/caminhoes-a-diesel" className="text-gray-400 hover:text-[#0252A7] transition-colors text-sm">
                    Caminhões
                  </Link>
                </li>
                <li>
                  <Link href="/categoria/onibus" className="text-gray-400 hover:text-[#0252A7] transition-colors text-sm">
                    Ônibus
                  </Link>
                </li>
                <li>
                  <Link href="/categoria/linha-agricola" className="text-gray-400 hover:text-[#0252A7] transition-colors text-sm">
                    Linha Agrícola
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Hours - Spans 4 columns */}
            <div className="lg:col-span-4">
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Entre em Contato</h4>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 group">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <div className="text-sm">
                    <p className="text-gray-300">Av. Dom Pedro II, 120 - Centro</p>
                    <p className="text-gray-400">Tapejara/RS - CEP: 99950-000</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 group">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <a href="tel:+555433441455" className="text-gray-300 hover:text-[#0252A7] transition-colors text-sm">
                    (54) 3344-1455
                  </a>
                </div>
                
                <div className="flex items-center gap-3 group">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <a href="mailto:contato@spagnol.com.br" className="text-gray-300 hover:text-[#0252A7] transition-colors text-sm">
                    contato@spagnol.com.br
                  </a>
                </div>
              </div>
              
              {/* Horário de atendimento */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-300">Horário de Atendimento</span>
                </div>
                <div className="text-xs text-gray-400 space-y-1">
                  <p>Segunda a Sexta: 08:00 - 18:00</p>
                  <p>Sábado: 08:00 - 12:00</p>
                  <p>Domingo: Fechado</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="border-t border-white/10 pt-6 pb-6">
            <div className="text-center">
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Formas de Pagamento</h4>
              <div className="flex flex-wrap justify-center items-center gap-4">
                {/* Visa */}
                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-sm">
                  <svg className="h-6 w-auto" viewBox="0 0 48 16" fill="none">
                    <path d="M19.636 5.528h-3.007l-1.88 7.896h3.007l1.88-7.896zM13.731 5.528l-2.869 5.44-.342-1.722-.001-.004-1.002-4.318s-.121-1.396-1.409-1.396H3.25l-.049.187s1.485.309 3.224 1.354l2.674 8.355h3.203l4.763-9.896h-3.334zM43.876 11.356c.012-1.236-.571-2.176-1.935-2.951-.808-.492-1.302-.822-1.295-1.321 0-.442.418-.913 1.321-.913.754-.013 1.302.161 1.729.342l.206.098.311-1.923c-.46-.174-1.181-.361-2.077-.361-2.288 0-3.898 1.216-3.911 2.957-.019 1.287 1.15 2.004 2.027 2.432.902.439 1.205.719 1.199 1.111-.006.6-.719.875-1.383.875-.925 0-1.415-.136-2.176-.471l-.298-.143-.324 2.006c.54.249 1.539.465 2.575.477 2.432 0 4.013-1.199 4.031-3.056v-.154zM35.166 5.528h-1.789c-.554 0-969.249-1.396l-3.854 9.896h2.432l.547-1.51h2.97l.317 1.51h2.145l-1.872-9.896zm-3.366 6.476l1.217-3.366.7 3.366h-1.917z" fill="#1A1F71"/>
                  </svg>
                </div>
                
                {/* Mastercard */}
                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-sm">
                  <svg className="h-6 w-auto" viewBox="0 0 38 24" fill="none">
                    <circle cx="14" cy="12" r="9" fill="#EB001B"/>
                    <circle cx="24" cy="12" r="9" fill="#F79E1B"/>
                    <path d="M19 17.5c1.8-1.5 3-3.8 3-6.5s-1.2-5-3-6.5c-1.8 1.5-3 3.8-3 6.5s1.2 5 3 6.5z" fill="#FF5F00"/>
                  </svg>
                </div>
                
                {/* Pix */}
                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-sm">
                  <span className="text-[#32BCAD] font-bold text-lg">PIX</span>
                </div>
                
                {/* Boleto */}
                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-sm">
                  <svg className="h-6 w-auto" viewBox="0 0 40 24" fill="none">
                    <rect x="2" y="4" width="2" height="16" fill="white"/>
                    <rect x="6" y="4" width="1" height="16" fill="white"/>
                    <rect x="8" y="4" width="3" height="16" fill="white"/>
                    <rect x="12" y="4" width="1" height="16" fill="white"/>
                    <rect x="14" y="4" width="2" height="16" fill="white"/>
                    <rect x="18" y="4" width="1" height="16" fill="white"/>
                    <rect x="20" y="4" width="3" height="16" fill="white"/>
                    <rect x="24" y="4" width="1" height="16" fill="white"/>
                    <rect x="26" y="4" width="2" height="16" fill="white"/>
                    <rect x="30" y="4" width="1" height="16" fill="white"/>
                    <rect x="32" y="4" width="3" height="16" fill="white"/>
                    <rect x="36" y="4" width="2" height="16" fill="white"/>
                  </svg>
                </div>
                
                {/* Transferência */}
                <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-sm">
                  <span className="text-white text-sm font-medium">Transferência</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-white/10 pt-8">
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-gray-500 text-sm">
                  © {currentYear} Spagnol Mecânica Agrícola Ltda. Todos os direitos reservados.
                </p>
              </div>
              
              {/* CNPJ */}
              <div className="text-center">
                <p className="text-gray-600 text-xs">
                  CNPJ: 89.319.065/0001-08
                </p>
              </div>
              
              {/* Amage Credit */}
              <div className="flex items-center gap-3">
                <span className="text-gray-600 text-xs">Desenvolvido por</span>
                <a 
                  href="https://amage.com.br" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Image
                    src="/images/images-mec/amage-white.svg"
                    alt="Amage"
                    width={120}
                    height={45}
                    className="h-10 w-auto"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
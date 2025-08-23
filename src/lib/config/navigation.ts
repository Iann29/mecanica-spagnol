// Configuração de navegação - Mecânica Spagnol

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  disabled?: boolean;
  external?: boolean;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

// Links principais do header
export const mainNav: NavItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Sobre',
    href: '/sobre',
    description: 'Conheça a Mecânica Spagnol',
  },
  {
    title: 'Contato',
    href: '/contato',
    description: 'Entre em contato conosco',
  },
  {
    title: 'Blog',
    href: '/blog',
    description: 'Notícias e dicas',
  },
  {
    title: 'Loja',
    href: '/loja',
    description: 'Nossos produtos',
  },
];

// Links do footer organizados por seções
export const footerNav: NavSection[] = [
  {
    title: 'Categorias',
    items: [
      { title: 'Caminhonetes a Diesel', href: '/categoria/caminhonetes-a-diesel' },
      { title: 'Caminhões Pesados', href: '/categoria/caminhoes-pesados' },
      { title: 'Ônibus Rodoviários e Urbanos', href: '/categoria/onibus-rodoviarios-urbanos' },
      { title: 'Máquinas Agrícolas e Tratores', href: '/categoria/maquinas-agricolas-tratores' },
    ],
  },
  {
    title: 'Institucional',
    items: [
      { title: 'Sobre Nós', href: '/sobre' },
      { title: 'Contato', href: '/contato' },
      { title: 'Política de Privacidade', href: '/privacidade' },
      { title: 'Termos de Uso', href: '/termos' },
    ],
  },
  {
    title: 'Atendimento',
    items: [
      { title: 'Central de Ajuda', href: '/ajuda' },
      { title: 'Como Comprar', href: '/como-comprar' },
      { title: 'Trocas e Devoluções', href: '/trocas-devolucoes' },
      { title: 'Fale Conosco', href: '/contato' },
    ],
  },
];

// Links do menu de usuário
export const userNav: NavItem[] = [
  {
    title: 'Minha Conta',
    href: '/minha-conta',
  },
  {
    title: 'Meus Pedidos',
    href: '/meus-pedidos',
  },
];

// Links do menu admin
export const adminNav: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
  },
  {
    title: 'Produtos',
    href: '/admin/produtos',
  },
  {
    title: 'Pedidos',
    href: '/admin/pedidos',
  },
];
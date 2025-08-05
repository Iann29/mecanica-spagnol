'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

// Sample blog data - in a real app, this would come from an API or database
const blogArticles = [
  {
    id: 1,
    slug: 'checklist-manutencao-preventiva',
    title: 'Checklist de Manutenção Preventiva para Seu Veículo',
    excerpt: 'Descubra os itens essenciais que você deve verificar regularmente para manter seu veículo em perfeitas condições e evitar problemas futuros.',
    image: '/images/img-blog/cheklist-blog1.jpg',
    category: 'Manutenção',
    date: '28 de Janeiro, 2025',
    readTime: '5 min de leitura'
  },
  {
    id: 2,
    slug: 'sistema-freios-guia-completo',
    title: 'Sistema de Freios: Guia Completo de Cuidados',
    excerpt: 'Entenda como funciona o sistema de freios do seu veículo e aprenda a identificar os sinais de desgaste antes que se tornem problemas graves.',
    image: '/images/img-blog/freio-blog2.png',
    category: 'Segurança',
    date: '25 de Janeiro, 2025',
    readTime: '7 min de leitura'
  },
  {
    id: 3,
    slug: 'tecnologia-motores-diesel',
    title: 'A Tecnologia dos Motores Diesel Modernos',
    excerpt: 'Conheça as inovações tecnológicas que tornam os motores diesel mais eficientes, econômicos e menos poluentes.',
    image: '/images/img-blog/motordiesel-blog3.jpg',
    category: 'Tecnologia',
    date: '22 de Janeiro, 2025',
    readTime: '10 min de leitura'
  },
  {
    id: 4,
    slug: 'pecas-originais-vs-paralelas',
    title: 'Peças Originais vs Paralelas: Qual Escolher?',
    excerpt: 'Entenda as diferenças entre peças originais e paralelas, e saiba quando cada uma pode ser a melhor opção para seu veículo.',
    image: '/images/pecas-originais-blog5.jpg',
    category: 'Peças',
    date: '18 de Janeiro, 2025',
    readTime: '6 min de leitura'
  },
  {
    id: 5,
    slug: 'economia-combustivel-diesel',
    title: 'Dicas para Economizar Combustível em Veículos Diesel',
    excerpt: 'Aprenda técnicas comprovadas para reduzir o consumo de diesel e aumentar a eficiência do seu veículo pesado.',
    image: '/images/diesel-blog4.jpg',
    category: 'Economia',
    date: '15 de Janeiro, 2025',
    readTime: '8 min de leitura'
  },
  {
    id: 6,
    slug: 'manutencao-maquinas-agricolas',
    title: 'Manutenção de Máquinas Agrícolas na Entressafra',
    excerpt: 'Saiba como preparar e manter suas máquinas agrícolas durante o período de entressafra para garantir máximo desempenho.',
    image: '/images/entressafra-blog6.jpeg',
    category: 'Agricultura',
    date: '10 de Janeiro, 2025',
    readTime: '12 min de leitura'
  }
];

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Get unique categories
  const categories = ['Todos', ...Array.from(new Set(blogArticles.map(article => article.category)))];

  // Filter articles based on search term and category
  const filteredArticles = blogArticles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-[#0252A7]/10 to-white py-12 sm:py-16">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center">
            <h1 className="text-3xl sm:text-3xl md:text-5xl font-bold text-[#0252A7] mb-4">
              Blog Spagnol
            </h1>
            <div className="w-20 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#0252A7] to-transparent mx-auto mb-4"></div>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Dicas, curiosidades e informações importantes sobre manutenção e cuidados com seu veículo
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar artigos por palavras-chave..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-[#0a0a0a] placeholder-gray-500 focus:outline-none focus:border-[#0252A7] transition-colors"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-[#0a0a0a] focus:outline-none focus:border-[#0252A7] transition-colors appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M10.293%203.293%206%207.586%201.707%203.293A1%201%200%200%200%20.293%204.707l5%205a1%201%200%200%200%201.414%200l5-5a1%201%200%201%200-1.414-1.414z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px] bg-[right_1rem_center] bg-no-repeat pr-12"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-gray-600 mb-8">
            {filteredArticles.length} {filteredArticles.length === 1 ? 'artigo encontrado' : 'artigos encontrados'}
          </p>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredArticles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg overflow-hidden shadow-lg group hover:transform hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
              >
                <Link href={`/blog/${article.slug}`}>
                  <div className="aspect-[16/9] relative overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="bg-[#0252A7]/20 text-[#0252A7] px-3 py-1 rounded-full">
                        {article.category}
                      </span>
                      <span>{article.readTime}</span>
                    </div>
                    <h2 className="text-xl font-bold text-[#0a0a0a] mb-3 line-clamp-2 group-hover:text-[#0252A7] transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{article.date}</span>
                      <span className="text-[#0252A7] font-semibold group-hover:translate-x-2 transition-transform inline-flex items-center gap-2">
                        Ler mais
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* No Results Message */}
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                Nenhum artigo encontrado com os critérios de busca.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
'use client';

import { useEffect, useState, useRef } from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Users, Target, Award, Wrench, Clock, Shield, Truck } from 'lucide-react';
import Lenis from 'lenis';
import { Timeline } from '@/components/ui/timeline';

const timelineData = [
  {
    year: '1970',
    title: 'As origens do legado',
    description: 'Com a dissolução da antiga sociedade, nasce o embrião da Mecânica Agrícola Spagnol. Fundada por João Spagnol, a oficina deu seus primeiros passos em outubro daquele ano.',
    image: '/images/imagens-historia/1970.jpeg',
    rotate: true,
  },
  {
    year: '1976',
    title: 'Estrutura e crescimento',
    description: 'A empresa amplia sua atuação, estrutura física e carteira de clientes. A marca Spagnol começa a se destacar pelo atendimento técnico e confiável.',
    image: '/images/imagens-historia/1976.jpeg',
    rotate: true,
  },
  {
    year: '1983',
    title: 'Fundação oficial da empresa',
    description: 'É fundada oficialmente a Mecânica Agrícola Spagnol LTDA. João Spagnol lidera o time ao lado de Mauro Spagnol, João Carlos Spagnol e Enilde Spagnol.',
    image: '/images/imagens-historia/1983.jpeg',
    rotate: true,
  },
  {
    year: '1999',
    title: 'Continuidade familiar e inovação',
    description: 'A nova geração assume: Tiago e Mauren Spagnol preservam o legado e modernizam a operação, mantendo a excelência como prioridade.',
    image: '/images/imagens-historia/1999.jpeg',
    rotate: true,
  },
  {
    year: '2023',
    title: 'Referência na região',
    description: 'Com mais de 50 anos de história, a Mecânica Spagnol é reconhecida como referência regional em mecânica pesada e manutenção de linha agrícola.',
    image: '/images/imagens-historia/2023.jpeg',
    rotate: false,
  },
  {
    year: '2025',
    title: 'Atualmente',
    description: 'Hoje, a Mecânica Spagnol continua sua jornada de excelência, combinando tradição familiar com inovação tecnológica. Nossa estrutura moderna e equipe qualificada atendem clientes em toda a região, mantendo o compromisso com qualidade e confiança que nos acompanha desde o início.',
    image: '/images/images-mec/banner-mecanica-fundo.jpeg',
    rotate: false,
  },
];

const values = [
  {
    icon: CheckCircle2,
    title: 'Qualidade',
    description: 'Trabalhamos apenas com peças originais e de primeira linha',
  },
  {
    icon: Users,
    title: 'Atendimento',
    description: 'Equipe técnica especializada para melhor atender nossos clientes',
  },
  {
    icon: Target,
    title: 'Compromisso',
    description: 'Entrega rápida e pontual em todo o território nacional',
  },
  {
    icon: Award,
    title: 'Experiência',
    description: 'Mais de 50 anos de tradição no mercado de mecânica pesada',
  },
];

const services = [
  {
    icon: Wrench,
    title: 'Mecânica Pesada',
    description: 'Especialistas em manutenção e reparo de caminhões, ônibus e máquinas agrícolas',
  },
  {
    icon: Truck,
    title: 'Peças Genuínas',
    description: 'Estoque completo de peças originais para linha pesada e agrícola',
  },
  {
    icon: Clock,
    title: 'Atendimento Ágil',
    description: 'Diagnóstico rápido e orçamento transparente para sua tranquilidade',
  },
  {
    icon: Shield,
    title: 'Garantia de Qualidade',
    description: 'Todas as peças e serviços com garantia e procedência comprovada',
  },
];

const CountUp = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      setCount(Math.floor(progress * end));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration, isVisible]);

  return <span ref={ref}>+{count}</span>;
};

export default function SobrePage() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Background Image */}
      <section className="container mx-auto px-3 sm:px-4 pt-4 sm:pt-6">
        <div className="relative rounded-sm overflow-hidden min-h-[350px] sm:min-h-[500px] flex items-end">
          <Image
            src="/images/images-mec/banner-mecanica-fundo.jpeg"
            alt="Mecânica Spagnol"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="relative z-10 w-full">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-background rounded-t-sm p-2 sm:p-3 max-w-sm mx-auto"
            >
              <h1 className="text-base sm:text-lg font-bebas uppercase text-[#0455A2] text-center tracking-wide">
                Conheça melhor a Mecânica Spagnol
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-12 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 sm:gap-12 lg:gap-20 items-start lg:items-center mb-12 sm:mb-20">
              {/* Text Content */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-left"
              >
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-4 sm:mb-6 font-ibm">
                  A <span className="text-[#0455A2] font-semibold">Mecânica Spagnol</span> é uma empresa familiar que há mais de cinco décadas se dedica 
                  ao segmento de mecânica pesada e peças agrícolas. Nossa trajetória é marcada pela 
                  excelência no atendimento, qualidade dos produtos e o compromisso com cada cliente 
                  que confia em nosso trabalho.
                </p>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Especialistas em manutenção e reparo de caminhões, ônibus e máquinas agrícolas, 
                  oferecemos um estoque completo de peças originais para linha pesada e agrícola. 
                  Com diagnóstico rápido e orçamento transparente, garantimos todas as peças e 
                  serviços com procedência comprovada.
                </p>
              </motion.div>

              {/* Numbers Cards */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="grid gap-8 justify-self-end w-full"
              >
                <Card className="bg-[#0455A2] text-white p-4 sm:p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px),
                                       repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)`
                    }}></div>
                  </div>
                  <CardContent className="p-0 relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bebas-bold uppercase mb-1 sm:mb-2 tracking-wide">
                      <CountUp end={50} duration={2000} /> anos
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 font-ibm">de experiência no mercado</p>
                  </CardContent>
                </Card>
                <Card className="bg-[#0455A2] text-white p-4 sm:p-6 text-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px),
                                       repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)`
                    }}></div>
                  </div>
                  <CardContent className="p-0 relative z-10">
                    <h3 className="text-xl sm:text-2xl font-bebas-bold uppercase mb-1 sm:mb-2 tracking-wide">
                      <CountUp end={35} duration={2000} /> mil
                    </h3>
                    <p className="text-sm sm:text-base text-white/90 font-ibm">peças em nosso estoque</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Mission, Vision, Values */}
            <div className="grid gap-8 sm:gap-12 md:grid-cols-3 mt-12 sm:mt-16 lg:mt-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0455A2]"></div>
                <div className="pt-6">
                  <h3 className="text-lg font-bebas-bold uppercase text-[#0455A2] mb-4 tracking-wide">Missão</h3>
                  <p className="text-muted-foreground font-ibm">
                    Fornecer soluções completas em mecânica pesada e peças agrícolas, 
                    com excelência no atendimento e preços competitivos, contribuindo 
                    para o sucesso de nossos clientes.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0455A2]"></div>
                <div className="pt-6">
                  <h3 className="text-lg font-bebas-bold uppercase text-[#0455A2] mb-4 tracking-wide">Visão</h3>
                  <p className="text-muted-foreground font-ibm">
                    Ser reconhecida como a empresa líder em mecânica pesada e peças 
                    agrícolas na região, expandindo nossa atuação com a mesma qualidade 
                    e compromisso que nos trouxeram até aqui.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-[#0455A2]"></div>
                <div className="pt-6">
                  <h3 className="text-lg font-bebas-bold uppercase text-[#0455A2] mb-4 tracking-wide">Valores</h3>
                  <p className="text-muted-foreground font-ibm">
                    Honestidade, transparência, qualidade, compromisso com prazos, 
                    respeito aos clientes e colaboradores, e responsabilidade 
                    socioambiental.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="-mx-4 sm:-mx-8 md:-mx-0">
        <Timeline 
          data={timelineData.map(item => ({
            title: item.year,
            content: (
              <div className="pb-8">
                <h3 className="text-lg sm:text-xl font-bebas-bold uppercase text-[#0455A2] mb-3 tracking-wide">
                  {item.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm sm:text-base leading-relaxed max-w-2xl font-ibm">
                  {item.description}
                </p>
                <div className="relative max-w-lg">
                  <Image
                    src={item.image}
                    alt={`Mecânica Spagnol - ${item.year}`}
                    width={500}
                    height={375}
                    className={`rounded-sm shadow-xl w-full ${item.rotate ? "-rotate-90" : ""}`}
                    style={item.rotate ? { maxWidth: '375px', margin: '40px 0' } : {}}
                  />
                </div>
              </div>
            )
          }))}
        />
      </section>


    </div>
  );
}
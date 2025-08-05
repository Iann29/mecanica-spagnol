'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'

interface CarouselItem {
  path: string
  title: string
}

interface Carousel3DProps {
  items: CarouselItem[]
}

export function Carousel3D({ items }: Carousel3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    if (!containerRef.current) return
    
    const style = document.createElement('style')
    style.textContent = `
      @keyframes carousel3d {
        0% {
          transform: translateY(200%) translateZ(-400px) rotateX(-20deg) scale(0.6);
          opacity: 0;
        }
        10% {
          opacity: 0.8;
        }
        50% {
          transform: translateY(0) translateZ(0) rotateX(-30deg) scale(1);
          opacity: 1;
        }
        90% {
          opacity: 0.8;
        }
        100% {
          transform: translateY(-200%) translateZ(-400px) rotateX(-40deg) scale(0.6);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
    
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  
  return (
    <div ref={containerRef} className="relative h-full min-h-[400px] md:min-h-[500px] overflow-hidden">
      {/* Gradiente superior */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#0252A7] to-transparent z-20 pointer-events-none"></div>
      {/* Gradiente inferior */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0252A7] to-transparent z-20 pointer-events-none"></div>
      
      {/* Container do carrossel */}
      <div 
        className="absolute inset-0 flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <div 
          className="relative w-full h-full"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {[...items, ...items].map((item, index) => (
            <div
              key={`${item.path}-${index}`}
              className="absolute inset-0 flex items-center justify-center"
              style={{
                transformStyle: 'preserve-3d',
                animation: `carousel3d 30s linear infinite`,
                animationDelay: `${index * 1.5}s`,
              }}
            >
              <div 
                className="relative w-80 h-56 transform-gpu"
                style={{
                  boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.4)',
                  transform: 'translateZ(50px)',
                }}
              >
                <Image
                  src={item.path}
                  alt={item.title}
                  fill
                  className="object-cover rounded-lg"
                  priority={index < 3}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
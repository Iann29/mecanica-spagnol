"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-background font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-20 px-4 md:px-8 lg:px-10 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bebas-bold uppercase text-[#0455A2] mb-4 tracking-wide">
          Nossa História
        </h2>
        <div className="w-20 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-[#0455A2] to-transparent mx-auto mb-4"></div>
        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto font-ibm">
          Mais de cinco décadas construindo uma história de sucesso e confiança
        </p>
      </div>

      <div ref={ref} className="relative max-w-6xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-16 md:pt-24 md:gap-8 items-start"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start md:w-auto">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-sm bg-[#0455A2] flex items-center justify-center">
                <div className="h-4 w-4 rounded-sm bg-white" />
              </div>
              <h3 className="hidden md:block text-3xl md:pl-20 font-bebas-bold uppercase text-[#0455A2] whitespace-nowrap tracking-wide">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-32 w-full max-w-4xl">
              <h3 className="md:hidden block text-xl mb-4 text-left font-bebas-bold uppercase text-[#0455A2] tracking-wide">
                {item.title}
              </h3>
              <div className="md:pl-0">
                {item.content}
              </div>
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-gray-200"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-[#0455A2]"
          >
            <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-sm bg-[#0455A2] border-2 border-white shadow-lg" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
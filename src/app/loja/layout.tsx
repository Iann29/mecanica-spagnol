import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loja",
  description: "Encontre as melhores peças e acessórios automotivos para caminhões, ônibus e máquinas agrícolas",
};

export default function ProdutosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

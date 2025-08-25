// Types de Formulários - Mecânica Spagnol

import { z } from 'zod';

// Schema de login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres')
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Schema de cadastro
export const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  confirmPassword: z.string(),
  full_name: z.string().min(3, 'Nome completo é obrigatório'),
  phone: z.string().optional(),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido').optional()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
});

export type SignupFormData = z.infer<typeof signupSchema>;

// Schema de endereço
export const addressSchema = z.object({
  cep: z.string().regex(/^\d{5}-\d{3}$/, 'CEP inválido'),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  is_default: z.boolean().default(false)
});

export type AddressFormData = z.infer<typeof addressSchema>;

// Schema de produto (admin)
export const productSchema = z.object({
  sku: z.string().min(3, 'SKU é obrigatório'),
  name: z.string().min(3, 'Nome é obrigatório'),
  slug: z.string().min(3, 'Slug é obrigatório'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo'),
  sale_price: z.number().positive().optional(),
  stock_quantity: z.number().int().min(0, 'Estoque não pode ser negativo'),
  category_id: z.number().int().positive('Categoria é obrigatória'),
  images: z.array(z.string()).default([]),
  specifications: z.record(z.string(), z.any()).default({}),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  reference: z.string().max(100, 'Referência deve ter no máximo 100 caracteres').optional(),
  meta_title: z.string().max(60, 'Título SEO deve ter no máximo 60 caracteres').optional(),
  meta_description: z.string().max(160, 'Descrição SEO deve ter no máximo 160 caracteres').optional(),
  meta_keywords: z.string().optional()
});

export type ProductFormData = z.infer<typeof productSchema>;

// Schema de checkout
export const checkoutSchema = z.object({
  // Dados pessoais
  email: z.string().email('Email inválido'),
  full_name: z.string().min(3, 'Nome completo é obrigatório'),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  
  // Endereço de entrega
  shipping_address: addressSchema,
  
  // Método de pagamento (preparar estrutura)
  payment_method: z.enum(['credit_card', 'pix', 'boleto']).optional(),
  
  // Notas do pedido
  notes: z.string().optional()
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Schema de contato
export const contactSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Assunto é obrigatório'),
  message: z.string().min(10, 'Mensagem deve ter no mínimo 10 caracteres')
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Schema de busca
export const searchSchema = z.object({
  query: z.string().min(2, 'Digite pelo menos 2 caracteres')
});

export type SearchFormData = z.infer<typeof searchSchema>;
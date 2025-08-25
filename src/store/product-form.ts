import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ProductFormValues } from '@/types/forms'

interface ProductFormStore {
  // Estado do formulário
  formData: Partial<ProductFormValues>
  mode: 'create' | 'edit'
  productId?: string
  
  // Dados temporários não persistidos
  images: string[]
  uploadedFiles: string[]
  categories: { id: number; name: string }[]
  
  // Ações
  updateFormData: (data: Partial<ProductFormValues>) => void
  updateField: <K extends keyof ProductFormValues>(field: K, value: ProductFormValues[K]) => void
  setImages: (images: string[]) => void
  addUploadedFile: (fileName: string) => void
  setCategories: (categories: { id: number; name: string }[]) => void
  setMode: (mode: 'create' | 'edit', productId?: string) => void
  clearForm: () => void
  
  // Debug helpers
  getDebugInfo: () => object
}

const initialFormData: Partial<ProductFormValues> = {
  sku: '',
  name: '',
  slug: '',
  description: '',
  price: 0,
  sale_price: undefined,
  stock_quantity: 0,
  category_id: 1,
  images: [],
  specifications: {},
  is_featured: false,
  is_active: true,
  reference: '',
  meta_title: '',
  meta_description: '',
  meta_keywords: '',
}

export const useProductFormStore = create<ProductFormStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      formData: initialFormData,
      mode: 'create',
      productId: undefined,
      
      // Dados temporários (não persistidos)
      images: [],
      uploadedFiles: [],
      categories: [],
      
      // Ações
      updateFormData: (data) => {
        // Só loga se realmente mudou algo significativo
        const currentData = get().formData
        const hasRealChanges = Object.keys(data).some(key => 
          JSON.stringify(currentData[key as keyof typeof currentData]) !== JSON.stringify(data[key as keyof typeof data])
        )
        
        if (hasRealChanges) {
        }
        
        set((state) => ({
          formData: { ...state.formData, ...data }
        }))
      },
      
      updateField: (field, value) => {
        // Só loga mudanças importantes (não em campos vazios)
        if (value && value !== '') {
        }
        set((state) => ({
          formData: { ...state.formData, [field]: value }
        }))
      },
      
      setImages: (images) => {
        set({ images })
        // Também atualizar no formData
        set((state) => ({
          formData: { ...state.formData, images }
        }))
      },
      
      addUploadedFile: (fileName) => {
        set((state) => ({
          uploadedFiles: [...state.uploadedFiles, fileName]
        }))
      },
      
      setCategories: (categories) => {
        set({ categories })
      },
      
      setMode: (mode, productId) => {
        set({ mode, productId })
        
        // Se mudou para modo create, limpar dados
        if (mode === 'create') {
          set({ formData: initialFormData })
        }
      },
      
      clearForm: () => {
        set({
          formData: initialFormData,
          images: [],
          uploadedFiles: [],
          mode: 'create',
          productId: undefined
        })
      },
      
      getDebugInfo: () => {
        const state = get()
        return {
          mode: state.mode,
          productId: state.productId,
          formDataKeys: Object.keys(state.formData),
          imagesCount: state.images.length,
          uploadedFilesCount: state.uploadedFiles.length,
          categoriesCount: state.categories.length,
          hasName: !!state.formData.name,
          hasSku: !!state.formData.sku,
          categoryId: state.formData.category_id
        }
      }
    }),
    {
      name: 'product-form-storage',
      storage: createJSONStorage(() => localStorage),
      
      // Só persistir os dados do formulário, não os temporários
      partialize: (state) => ({
        formData: state.formData,
        mode: state.mode,
        productId: state.productId
      }),
      
      // Filtrar dados sensíveis ou temporários dos logs
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Rehydrated from localStorage
        }
      }
    }
  )
)

import { useState, useEffect } from 'react'
import { supabase, type WikiTemplate, type WikiCategory } from '@/lib/supabase'

export function useWiki() {
  const [templates, setTemplates] = useState<WikiTemplate[]>([])
  const [categories, setCategories] = useState<WikiCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWikiData = async () => {
    try {
      setLoading(true)
      
      // Buscar templates
      const { data: templatesData, error: templatesError } = await supabase
        .from('wiki_templates')
        .select('*')
        .order('stars', { ascending: false })

      if (templatesError) throw templatesError

      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('wiki_categories')
        .select('*')
        .order('name')

      if (categoriesError) throw categoriesError

      setTemplates(templatesData || [])
      setCategories(categoriesData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados do Wiki')
    } finally {
      setLoading(false)
    }
  }

  const addTemplate = async (template: Omit<WikiTemplate, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('wiki_templates')
        .insert([template])
        .select()
        .single()

      if (error) throw error
      setTemplates(prev => [data, ...prev])
      
      // Atualizar contador da categoria
      await updateCategoryCount(template.category)
      
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar template')
      throw err
    }
  }

  const updateTemplate = async (id: number, updates: Partial<WikiTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('wiki_templates')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setTemplates(prev => prev.map(template => template.id === id ? data : template))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar template')
      throw err
    }
  }

  const deleteTemplate = async (id: number) => {
    try {
      const template = templates.find(t => t.id === id)
      
      const { error } = await supabase
        .from('wiki_templates')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTemplates(prev => prev.filter(template => template.id !== id))
      
      // Atualizar contador da categoria
      if (template) {
        await updateCategoryCount(template.category)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar template')
      throw err
    }
  }

  const incrementStars = async (id: number) => {
    try {
      const template = templates.find(t => t.id === id)
      if (!template) return

      const { data, error } = await supabase
        .from('wiki_templates')
        .update({ stars: template.stars + 1 })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setTemplates(prev => prev.map(t => t.id === id ? data : t))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao incrementar estrelas')
      throw err
    }
  }

  const incrementDownloads = async (id: number) => {
    try {
      const template = templates.find(t => t.id === id)
      if (!template) return

      const { data, error } = await supabase
        .from('wiki_templates')
        .update({ downloads: template.downloads + 1 })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setTemplates(prev => prev.map(t => t.id === id ? data : t))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao incrementar downloads')
      throw err
    }
  }

  const updateCategoryCount = async (categoryName: string) => {
    try {
      const count = templates.filter(t => t.category === categoryName).length
      
      const { error } = await supabase
        .from('wiki_categories')
        .update({ count })
        .eq('name', categoryName)

      if (error) throw error
      
      // Atualizar estado local das categorias
      setCategories(prev => prev.map(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase() 
          ? { ...cat, count } 
          : cat
      ))
    } catch (err) {
      console.error('Erro ao atualizar contador da categoria:', err)
    }
  }

  const copyToClipboard = async (code: string, templateId: number) => {
    try {
      // Verificar se clipboard API está disponível
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(code)
      } else {
        // Fallback para browsers mais antigos
        const textArea = document.createElement('textarea')
        textArea.value = code
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand('copy')
        textArea.remove()
      }
      
      // Incrementar downloads quando copiar
      await incrementDownloads(templateId)
      
      // Mostrar feedback visual (opcional)
      console.log('Código copiado para clipboard!')
    } catch (err) {
      console.error('Erro ao copiar para clipboard:', err)
      // Tentar fallback manual
      try {
        const textArea = document.createElement('textarea')
        textArea.value = code
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        await incrementDownloads(templateId)
      } catch (fallbackErr) {
        console.error('Erro no fallback de cópia:', fallbackErr)
      }
    }
  }

  useEffect(() => {
    fetchWikiData()
  }, [])

  return {
    templates,
    categories,
    loading,
    error,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    incrementStars,
    incrementDownloads,
    copyToClipboard,
    refetch: fetchWikiData
  }
}

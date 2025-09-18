import { useState, useEffect } from 'react'
import { supabase, type Resource, type ResourceCategory, type QuickLink } from '@/lib/supabase'

export function useResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [categories, setCategories] = useState<ResourceCategory[]>([])
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchResources = async () => {
    try {
      setLoading(true)
      
      // Buscar recursos
      const { data: resourcesData, error: resourcesError } = await supabase
        .from('resources')
        .select('*')
        .order('downloads', { ascending: false })

      if (resourcesError) throw resourcesError

      // Buscar categorias
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('resource_categories')
        .select('*')
        .order('title')

      if (categoriesError) throw categoriesError

      // Buscar links rápidos
      const { data: quickLinksData, error: quickLinksError } = await supabase
        .from('quick_links')
        .select('*')
        .order('created_at')

      if (quickLinksError) throw quickLinksError

      setResources(resourcesData || [])
      setCategories(categoriesData || [])
      setQuickLinks(quickLinksData || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar recursos')
    } finally {
      setLoading(false)
    }
  }

  const addResource = async (resource: Omit<Resource, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .insert([resource])
        .select()
        .single()

      if (error) throw error
      setResources(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar recurso')
      throw err
    }
  }

  const updateResource = async (id: number, updates: Partial<Resource>) => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setResources(prev => prev.map(resource => resource.id === id ? data : resource))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar recurso')
      throw err
    }
  }

  const deleteResource = async (id: number) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id)

      if (error) throw error
      setResources(prev => prev.filter(resource => resource.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar recurso')
      throw err
    }
  }

  const incrementDownloads = async (id: number) => {
    try {
      const resource = resources.find(r => r.id === id)
      if (!resource) return

      const { data, error } = await supabase
        .from('resources')
        .update({ downloads: resource.downloads + 1 })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setResources(prev => prev.map(r => r.id === id ? data : r))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao incrementar downloads')
      throw err
    }
  }

  useEffect(() => {
    fetchResources()
  }, [])

  return {
    resources,
    categories,
    quickLinks,
    loading,
    error,
    addResource,
    updateResource,
    deleteResource,
    incrementDownloads,
    refetch: fetchResources
  }
}

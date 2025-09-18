import { useState, useEffect } from 'react'
import { supabase, type Client } from '@/lib/supabase'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setClients(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  const addClient = async (client: Omit<Client, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([client])
        .select()
        .single()

      if (error) throw error
      setClients(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar cliente')
      throw err
    }
  }

  const updateClient = async (id: number, updates: Partial<Client>) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      setClients(prev => prev.map(client => client.id === id ? data : client))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar cliente')
      throw err
    }
  }

  const deleteClient = async (id: number) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id)

      if (error) throw error
      setClients(prev => prev.filter(client => client.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar cliente')
      throw err
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  return {
    clients,
    loading,
    error,
    addClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  }
}

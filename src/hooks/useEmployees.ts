import { useEffect, useState } from 'react'
import { supabase, type Employee } from '@/lib/supabase'

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEmployees(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar funcionários')
    } finally {
      setLoading(false)
    }
  }

  const addEmployee = async (employee: Omit<Employee, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('employees')
      .insert([employee])
      .select()
      .single()
    if (error) throw error
    setEmployees(prev => [data, ...prev])
    return data
  }

  const updateEmployee = async (id: number, updates: Partial<Employee>) => {
    const { data, error } = await supabase
      .from('employees')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    setEmployees(prev => prev.map(e => (e.id === id ? data : e)))
    return data
  }

  const deleteEmployee = async (id: number) => {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id)
    if (error) throw error
    setEmployees(prev => prev.filter(e => e.id !== id))
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  return {
    employees,
    loading,
    error,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    refetch: fetchEmployees,
  }
}

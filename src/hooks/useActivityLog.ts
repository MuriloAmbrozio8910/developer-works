import { useState, useEffect } from 'react'
import { supabase, type ActivityLog } from '@/lib/supabase'

export function useActivityLog() {
  const [activities, setActivities] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      setActivities(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atividades')
    } finally {
      setLoading(false)
    }
  }

  const addActivity = async (activity: Omit<ActivityLog, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('activity_logs')
        .insert([activity])
        .select()
        .single()

      if (error) throw error
      setActivities(prev => [data, ...prev.slice(0, 9)]) // Keep only 10 most recent
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar atividade')
      throw err
    }
  }

  useEffect(() => {
    fetchActivities()
  }, [])

  return {
    activities,
    loading,
    error,
    addActivity,
    refetch: fetchActivities
  }
}

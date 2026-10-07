import { useState, useEffect } from 'react'
import { supabase, type Task } from '@/lib/supabase'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          client:clients(*),
          assignee_employee:employees(*)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTasks(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas')
    } finally {
      setLoading(false)
    }
  }

  const addTask = async (task: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'client' | 'assignee_employee'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select(`
          *,
          client:clients(*),
          assignee_employee:employees(*)
        `)
        .single()

      if (error) throw error
      setTasks(prev => [data, ...prev])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar tarefa')
      throw err
    }
  }

  const updateTask = async (id: number, updates: Partial<Task>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          client:clients(*),
          assignee_employee:employees(*)
        `)
        .single()

      if (error) throw error
      setTasks(prev => prev.map(task => task.id === id ? data : task))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tarefa')
      throw err
    }
  }

  const deleteTask = async (id: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)

      if (error) throw error
      setTasks(prev => prev.filter(task => task.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar tarefa')
      throw err
    }
  }

  const toggleTimer = async (id: number) => {
    try {
      const task = tasks.find(t => t.id === id)
      if (!task) return

      const now = new Date().toISOString()
      const updates: Partial<Task> = {
        is_running: !task.is_running,
        started_at: !task.is_running ? now : null
      }

      // Se estiver iniciando o timer e a tarefa estiver pendente, mudar para "em_andamento"
      if (!task.is_running && task.status === 'pendente') {
        updates.status = 'em_andamento'
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          client:clients(*),
          assignee_employee:employees(*)
        `)
        .single()

      if (error) throw error
      setTasks(prev => prev.map(t => t.id === id ? data : t))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alternar timer')
      throw err
    }
  }

  const updateTaskTime = async (id: number, timeSpentSeconds: number) => {
    try {
      const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600)
        const minutes = Math.floor((seconds % 3600) / 60)
        if (hours > 0) {
          return `${hours}h ${minutes}m`
        } else {
          return `${minutes}m`
        }
      }

      const { data, error } = await supabase
        .from('tasks')
        .update({
          time_spent_seconds: timeSpentSeconds,
          time_spent: formatTime(timeSpentSeconds)
        })
        .eq('id', id)
        .select(`
          *,
          client:clients(*),
          assignee_employee:employees(*)
        `)
        .single()

      if (error) throw error
      setTasks(prev => prev.map(t => t.id === id ? data : t))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar tempo')
      throw err
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const updateTaskStatus = async (id: number, status: 'pendente' | 'em_andamento' | 'concluida') => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({
          status,
          // Se estiver marcando como concluída, parar o timer
          is_running: status === 'concluida' ? false : undefined
        })
        .eq('id', id)
        .select(`
          *,
          client:clients(*),
          assignee_employee:employees(*)
        `)
        .single()

      if (error) throw error
      setTasks(prev => prev.map(t => t.id === id ? data : t))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status da tarefa')
      throw err
    }
  }

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTimer,
    updateTaskTime,
    updateTaskStatus,
    refetch: fetchTasks
  }
}

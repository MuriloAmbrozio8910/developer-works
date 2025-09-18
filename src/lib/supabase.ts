import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // storage defaults to localStorage in browsers, but being explicit helps clarity
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

// Types para as tabelas
export interface Client {
  id: number
  name: string
  contact: string
  email: string
  phone: string
  photo: string
  company: string
  location: string
  status: 'Ativo' | 'Inativo'
  projects_count: number
  total_value: string
  join_date: string
  last_contact: string
  created_at?: string
  updated_at?: string
}

export interface Employee {
  id: number
  user_id?: string | null
  name: string
  email: string
  role?: string | null
  avatar_url?: string | null
  created_at?: string
  updated_at?: string
}

export interface Task {
  id: number
  title: string
  description: string
  client_id?: number
  client?: Client
  assignee_id?: number
  assignee_employee?: Employee
  assignee: string
  priority: 'Baixa' | 'Média' | 'Alta'
  type: string
  deadline: string
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada'
  time_spent_seconds: number
  time_spent: string
  estimated_time: string
  estimated_time_seconds: number
  is_running: boolean
  started_at?: string
  photos?: string[]
  notes?: string
  tags?: string[]
  created_at?: string
  updated_at?: string
}

export interface ActivityLog {
  id: number
  action: string
  details: string
  type: 'success' | 'info' | 'warning' | 'error'
  created_at: string
}

export interface Resource {
  id: number
  name: string
  description: string
  version: string
  size: string
  platform: string
  category: string
  rating: number
  downloads: number
  url: string
  created_at?: string
  updated_at?: string
}

export interface ResourceCategory {
  id: number
  title: string
  icon: string
  color: string
  created_at?: string
}

export interface QuickLink {
  id: number
  title: string
  description: string
  icon: string
  color: string
  url: string
  created_at?: string
}

export interface WikiTemplate {
  id: number
  title: string
  description: string
  category: string
  language: string
  author: string
  stars: number
  downloads: number
  tags: string[]
  code: string
  created_at?: string
  updated_at?: string
}

export interface WikiCategory {
  id: number
  name: string
  icon: string
  count: number
  created_at?: string
}

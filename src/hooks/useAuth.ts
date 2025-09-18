import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { Employee } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null)

  const ensureEmployeeForUser = useCallback(async (u: User | null) => {
    console.debug('[auth] ensureEmployeeForUser called', { userId: u?.id, email: u?.email })
    if (!u || !u.email) {
      setCurrentEmployee(null)
      return null
    }
    const emailNorm = u.email.toLowerCase()

    // 1) Tenta achar por user_id
    let { data: empByUserId, error: q1err } = await supabase
      .from('employees')
      .select('*')
      .eq('user_id', u.id)
      .limit(1)
      .maybeSingle()

    if (q1err && q1err.code !== undefined) {
      // log silencioso
      console.warn('ensureEmployeeForUser query by user_id error:', q1err)
    }

    if (empByUserId) {
      setCurrentEmployee(empByUserId)
      return empByUserId
    }

    // 2) Tenta achar por email (caso já exista sem user_id)
    let { data: empByEmail, error: q2err } = await supabase
      .from('employees')
      .select('*')
      .ilike('email', emailNorm)
      .limit(1)
      .maybeSingle()

    if (q2err && q2err.code !== undefined) {
      console.warn('ensureEmployeeForUser query by email error:', q2err)
    }

    if (empByEmail) {
      // Atualiza para associar o user_id se estiver faltando
      if (!empByEmail.user_id) {
        const { data: updated, error: upErr } = await supabase
          .from('employees')
          .update({ user_id: u.id })
          .eq('id', empByEmail.id)
          .select('*')
          .single()
        if (!upErr && updated) {
          setCurrentEmployee(updated)
          return updated
        }
      }
      setCurrentEmployee(empByEmail)
      return empByEmail
    }

    // 3) Se não achou, cria
    const nameFromMeta = (u.user_metadata?.full_name as string | undefined) || emailNorm.split('@')[0]
    const avatarFromMeta = (u.user_metadata?.avatar_url as string | undefined) || (u.user_metadata?.picture as string | undefined) || null

    const { data: created, error: insErr } = await supabase
      .from('employees')
      .insert([{
        user_id: u.id,
        name: nameFromMeta,
        email: emailNorm,
        avatar_url: avatarFromMeta,
      }])
      .select('*')
      .single()

    if (insErr) {
      // Se violou unique por email, buscar/associar o existente
      // @ts-ignore - code pode existir no objeto de erro
      if (insErr.code === '23505') {
        const { data: existing } = await supabase
          .from('employees')
          .select('*')
          .ilike('email', emailNorm)
          .limit(1)
          .maybeSingle()
        if (existing) {
          if (!existing.user_id) {
            const { data: updated } = await supabase
              .from('employees')
              .update({ user_id: u.id })
              .eq('id', existing.id)
              .select('*')
              .single()
            if (updated) {
              setCurrentEmployee(updated)
              return updated
            }
          }
          setCurrentEmployee(existing)
          return existing
        }
      }
      console.error('Erro ao criar employee para user:', insErr)
      setCurrentEmployee(null)
      return null
    }

    setCurrentEmployee(created)
    return created
  }, [])

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        console.debug('[auth] init: fetching session')
        const { data: sessionData, error } = await supabase.auth.getSession()
        if (error) throw error

        let sessionUser = sessionData.session?.user ?? null

        // Fallback: tenta getUser() caso não haja sessão imediata
        if (!sessionUser) {
          console.debug('[auth] init: no session found, falling back to getUser()')
          const { data: userData, error: userErr } = await supabase.auth.getUser()
          if (!userErr) {
            sessionUser = userData.user ?? null
          } else {
            console.warn('[auth] init: getUser() error', userErr)
          }
        }

        if (mounted) {
          setUser(sessionUser)
          console.debug('[auth] init: session resolved', { hasUser: !!sessionUser })
          // Não bloquear a UI: provisionar funcionário em background
          if (sessionUser) ensureEmployeeForUser(sessionUser)
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Erro de autenticação')
      } finally {
        if (mounted) {
          setLoading(false)
          console.debug('[auth] init: loading=false')
        }
      }
    }

    init()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const nextUser = session?.user ?? null
      console.debug('[auth] onAuthStateChange', { event, hasUser: !!nextUser })
      setUser(nextUser)
      // Provisionar em background; não travar a UI
      if (nextUser) ensureEmployeeForUser(nextUser)
    })

    return () => {
      mounted = false
      authListener.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    setUser(data.user ?? null)
    await ensureEmployeeForUser(data.user ?? null)
    return data
  }, [ensureEmployeeForUser])

  const signOut = useCallback(async () => {
    setError(null)
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setCurrentEmployee(null)
  }, [])

  const signUp = useCallback(async (email: string, password: string) => {
    setError(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    // Caso o signUp já crie sessão, provisiona o employee
    if (data.user) {
      await ensureEmployeeForUser(data.user)
    }
    return data
  }, [ensureEmployeeForUser])

  const reloadEmployee = useCallback(async () => {
    await ensureEmployeeForUser(user)
  }, [user, ensureEmployeeForUser])

  return {
    user,
    loading,
    error,
    currentEmployee,
    signIn,
    signOut,
    signUp,
    reloadEmployee,
  }
}

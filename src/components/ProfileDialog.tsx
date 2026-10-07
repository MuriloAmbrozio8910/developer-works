import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/components/ui/sonner'

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { currentEmployee, reloadEmployee } = useAuth()
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open && currentEmployee) {
      setName(currentEmployee.name || '')
      setRole(currentEmployee.role || '')
      setEmail(currentEmployee.email || '')
      setAvatarUrl(currentEmployee.avatar_url || null)
      setFile(null)
    }
  }, [open, currentEmployee])

  const previewUrl = useMemo(() => {
    if (file) return URL.createObjectURL(file)
    return avatarUrl || undefined
  }, [file, avatarUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) setFile(f)
  }

  const handleSave = async () => {
    if (!currentEmployee) return
    setSaving(true)
    try {
      let newAvatarUrl = avatarUrl

      if (file) {
        const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const path = `${currentEmployee.user_id}/${Date.now()}.${ext}`

        // Upload to Supabase Storage (make sure a public bucket named 'avatars' exists)
        const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'image/jpeg',
        })
        if (uploadErr) throw uploadErr

        const { data: pub } = supabase.storage.from('avatars').getPublicUrl(path)
        newAvatarUrl = pub.publicUrl
      }

      const { error: updErr } = await supabase
        .from('employees')
        .update({ name, role, avatar_url: newAvatarUrl })
        .eq('id', currentEmployee.id)
      if (updErr) throw updErr

      await reloadEmployee()
      toast.success('Perfil atualizado com sucesso')
      onOpenChange(false)
    } catch (err) {
      console.error(err)
      toast.error('Não foi possível salvar o perfil')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>Atualize sua foto de perfil, nome e cargo.</DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            {previewUrl && <AvatarImage src={previewUrl} alt={name} />}
            <AvatarFallback>{(name || 'U').slice(0,1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <Label htmlFor="avatar">Foto de perfil</Label>
            <Input id="avatar" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>

        <div className="grid gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Cargo</Label>
            <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={email} readOnly disabled />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

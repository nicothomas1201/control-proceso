'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  document: z.string().min(2).max(30),
  password: z.string().min(2).max(30),
})

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      document: '',
      password: '',
    },
  })

  async function onSubmit(values) {
    try {
      setLoading(true)
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('document', values.document)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      if (user.password === null) {
        const { error: updateError } = await supabase
          .from('users')
          .eq('document', values.document)
          .update({ password: values.password })

        if (updateError) {
          throw new Error(updateError.message)
        }

        router.push('/home')
      }

      if (user.password === values.password) {
        router.push('/home')
      } else {
        throw new Error('Contraseña incorrecta')
      }
    } catch (error) {
      console.error('An error ocurred', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documento</FormLabel>
              <FormControl>
                <Input placeholder="# documento" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="contraseña" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <LoaderCircle className="w-6 h-6 animate-spin" />
          ) : (
            'Ingresar'
          )}
        </Button>
      </form>
    </Form>
  )
}

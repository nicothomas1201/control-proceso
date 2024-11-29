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
import { automateProccess } from '@/actions/upload-proccess'

const formSchema = z.object({
  expediente: z.string().min(2).max(50),
  notebook: z.string().min(2).max(30),
  files: z
    .instanceof(File)
    .refine(
      (file) =>
        file.type === 'application/zip' ||
        file.type === 'application/x-zip-compressed',
      {
        message: 'Solo se permiten archivos ZIP',
      },
    ),
})

export function HomeForm() {
  const [loading, setLoading] = useState(false)
  // const router = useRouter()
  // const supabase = createClient()

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      expediente: '',
      notebook: '',
      files: null,
    },
  })

  async function onSubmit(values) {
    try {
      // await automateProccess({
      //   expediente: values.expediente,
      //   notebook: values.notebook,
      //   file: values.files,
      // })
      const formData = new FormData()
      formData.append('expediente', values.expediente)
      formData.append('notebook', values.notebook)
      formData.append('file', values.files)

      await fetch('/api/upload-control', {
        method: 'POST',
        body: formData,
      })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="expediente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numero de expediente</FormLabel>
              <FormControl>
                <Input placeholder="Nro expediente" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cuaderno</FormLabel>
              <FormControl>
                <Input type="text" placeholder="cuaderno" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subir carpeta</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".zip" // Solo acepta archivos .zip
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    field.onChange(file)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? (
            <LoaderCircle className="w-6 h-6 animate-spin" />
          ) : (
            'Subir archivos'
          )}
        </Button>
      </form>
    </Form>
  )
}

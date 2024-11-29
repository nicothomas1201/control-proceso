import { NextResponse } from 'next/server'
import { Puppeter } from '@/lib/puppetter'
import { FilesService } from '@/lib/files'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request) {
  const filesService = new FilesService()
  const { expediente, notebook, filePath } = await request.json()

  try {
    const cookiesStore = await cookies()
    const supabase = createClient(cookiesStore)

    const { data: file, error } = await supabase.storage
      .from('procesos')
      .download(filePath)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No se encontró el archivo' },
        { status: 404 },
      )
    }

    const automatic = new Puppeter()

    const buffer = Buffer.from(await file.arrayBuffer())

    await filesService.writeZipFile(expediente, notebook, buffer)
    await filesService.decompressFile(expediente, notebook)

    await automatic.launch()
    await automatic.searchExpediente(expediente)
    await automatic.searchNotebook(notebook)

    const uploadDocs = filesService.getDirFiles(expediente, notebook)
    const retrictExt = ['xlsm', 'xlsx']
    await automatic.createAllDocuments(
      uploadDocs.filter((doc) => !retrictExt.includes(doc.ext)),
    )

    return NextResponse.json({ expediente, notebook, file })
  } catch (err) {
    console.log(err)
    return NextResponse.json({ error: err }, { status: 500 })
  } finally {
    await filesService.deleteFolder(expediente)
    console.log('finally')
  }
}

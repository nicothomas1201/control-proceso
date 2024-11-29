import { NextResponse } from 'next/server'
import { Puppeter } from '@/lib/puppetter'
import { FilesService } from '@/lib/files'

export async function POST(request) {
  const formData = await request.formData()

  const expediente = formData.get('expediente')
  const notebook = formData.get('notebook')
  const file = formData.get('file')

  const filesService = new FilesService()
  try {
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

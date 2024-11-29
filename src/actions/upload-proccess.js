'use server'

import { Puppeter } from '@/lib/puppetter'
import { FilesService } from '@/lib/files'
import fs from 'fs'

// 68001400300820060097100

const zipsPath = `${process.cwd()}/src/storage/zip`
// const desPath = `${process.cwd()}/src/storage/des`

// async function decompressDir(file) {}

export async function automateProccess({ expediente, notebook, file }) {
  const filesService = new FilesService()
  try {
    const automatic = new Puppeter()

    const buffer = Buffer.from(await file.arrayBuffer())

    filesService.writeZipFile(expediente, notebook, buffer)
    await filesService.decompressFile(expediente, notebook)

    await automatic.launch()
    await automatic.searchExpediente(expediente)
    await automatic.searchNotebook(notebook)

    const uploadDocs = filesService.getDirFiles(expediente, notebook)
    const retrictExt = ['xlsm', 'xlsx']
    await automatic.createAllDocuments(
      uploadDocs.filter((doc) => !retrictExt.includes(doc.ext)),
    )
  } catch (err) {
    console.log(err)
  } finally {
    await filesService.deleteFolder(expediente)
  }

  // await automatic.uploadFile(file)
  // await automatic.close()
}

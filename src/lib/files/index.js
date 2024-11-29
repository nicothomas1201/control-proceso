import fs from 'fs'
import AdmZip from 'adm-zip'

// const { expediente } = await inquirer.prompt([
//   {
//     type: 'input',
//     name: 'expediente',
//     message: 'Ingrese el número del expediente:',
//     validate: (input) =>
//       input ? true : 'El número del expediente es obligatorio.',
//   },
// ])

// TODO: Validar si ya se ha descomprimido o no
// decompressFile(expediente)
export class FilesService {
  basepath = null
  filesPath = null
  outputDir = null

  constructor() {
    this.basepath = process.cwd() + '/src'
    this.filesPath = `${this.basepath}/storage`
    this.outputDir = `${this.filesPath}/des`
  }

  writeZipFile(expediente, notebook, buffer) {
    const zipsPath = `${this.filesPath}/zip/${expediente}`
    if (!fs.existsSync(zipsPath)) {
      fs.mkdirSync(zipsPath)
    }

    if (fs.existsSync(zipsPath + `/${notebook}.zip`)) {
      console.log('El archivo ya existe')
      return
    }

    fs.writeFile(zipsPath + `/${notebook}.zip`, buffer, (err) => {
      if (err) {
        console.error('Error al crear el archivo:', err)
      } else {
        console.log('Archivo creado y datos escritos con éxito')
      }
    })
  }

  getDirFiles(exp, notebook) {
    const expfile = `${this.outputDir}/${exp}/${notebook}`
    const extractedFiles = fs.readdirSync(expfile)

    return extractedFiles.map((file) => ({
      name: file,
      ext: file.split('.').pop(),
      path: `${expfile}/${file}`,
    }))
  }

  renameExtractedFiles(oldFolderName, newName, expediente) {
    const oldPath = `${this.outputDir}/${expediente}/${oldFolderName}`
    const newPath = `${this.outputDir}/${expediente}/${newName}`

    fs.renameSync(oldPath, newPath)
    console.log(`✅ Carpeta renombrada de "${oldFolderName}" a "${newName}".`)
  }

  async decompressFile(expediente, notebook) {
    if (fs.existsSync(`${this.outputDir}/${expediente}/${notebook}`)) {
      console.log(
        `❌ El expediente "${expediente}" ya ha sido descomprimido anteriormente.`,
      )
      return
    }

    const zipFilePath = `${this.filesPath}/zip/${expediente}/${notebook}.zip`

    if (!fs.existsSync(zipFilePath)) {
      console.log(`❌ El expediente "${expediente}" no existe.`)
      return
    }

    try {
      console.log(`✅ Archivo "${expediente}" encontrado.`)
      console.log('📂 Leyendo contenido del archivo ZIP...')

      const zip = new AdmZip(zipFilePath)
      const zipEntries = zip.getEntries()

      if (zipEntries.length === 0) {
        console.error(`❌ El archivo ZIP "${expediente}" está vacío.`)
        return
      }

      const oldFolderName = zipEntries[0].entryName.split('/')[0]

      if (!fs.existsSync(`${this.outputDir}/${expediente}`)) {
        fs.mkdirSync(`${this.outputDir}/${expediente}`)
        console.log(
          `📂 Carpeta de destino creada: "${`${this.outputDir}/${expediente}`}".`,
        )
      }

      await zip.extractAllTo(`${this.outputDir}/${expediente}`, true)

      if (oldFolderName !== notebook) {
        this.renameExtractedFiles(oldFolderName, notebook, expediente)
      }

      console.log(
        `✅ Archivo "${expediente}" descomprimido exitosamente en "${`${this.outputDir}/${expediente}`}".`,
      )
    } catch (error) {
      console.error(`❌ Error al descomprimir el archivo: ${error.message}`)
    }
  }
}
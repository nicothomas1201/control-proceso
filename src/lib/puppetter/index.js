import puppeteer from 'puppeteer-core'
import { nameDocumental } from '../utils'
import chromium from '@sparticuz/chromium'
// import fs from 'fs'

// const zipsPath = `${process.cwd()}/src/storage/zip`

export class Puppeter {
  browser = null
  page = null

  async launch() {
    this.browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    }) // `headless: false` para ver el navegador
    this.page = await this.browser.newPage()

    const screenWidth = 1000 // Ajusta a la resolución de tu pantalla
    const screenHeight = 1000

    // Establecer el tamaño del viewport
    await this.page.setViewport({
      width: screenWidth,
      height: screenHeight,
    })

    console.log('🌐 Navegando al sitio web...')
    await this.page.goto('https://controlproceso.ramajudicial.gov.co', {
      waitUntil: 'networkidle2',
    })

    await this.login()
  }

  async login() {
    try {
      console.log('✅ Llenando formulario de inicio de sesión...')
      // TODO: Change this to your credentials
      await this.page.type('#id_document', '63513383')
      await this.page.type('#id_password', 'Buc63513383')

      console.log('🚀 Iniciando sesión...')
      await this.page.click('button.btn-primary')
      await this.page.waitForSelector('a', {
        visible: true,
      }) // Cambia esto a un selector de la página posterior al login
      console.log('🎉 Inicio de sesión completado.')
    } catch (error) {
      console.error('❌ Error en el inicio de sesión:', error.message)
      throw new Error('Error en el inicio de sesión')
    }
  }

  async searchExpediente(expediente) {
    try {
      console.log(`🔍 Buscando expediente: ${expediente}...`)
      await this.page.goto(
        'https://controlproceso.ramajudicial.gov.co/fileupload/proceeding_list',
        { waitUntil: 'networkidle2' },
      )
      await this.page.waitForSelector('input[type="text"]', { visible: true })

      await this.page.type('input[type="text"]', expediente)
      await this.page.click('button[type="submit"]')

      await this.page.waitForSelector(`a[href="${expediente}"]`, {
        visible: true,
      }) // Espera a un elemento que indique que la búsqueda terminó

      await this.page.click(`a[href="${expediente}"]`)

      await this.page.waitForSelector('button:not([type="submit"])', {
        visible: true,
      })
    } catch (error) {
      console.error('❌ Error al buscar el expediente:', error.message)
      throw new Error('Error al buscar el expediente')
    }
  }

  async searchNotebook(notebook) {
    await this.page.type('input[type="text"]', notebook)
    await this.page.click('button[type="submit"]')
    await this.page.waitForSelector(`text/${notebook}`, {
      visible: true,
    })
    await this.page.locator(`text/${notebook}`).click()
  }

  async clickCreateDocument() {
    const spanText = await this.page.waitForSelector('text/Crear Documento', {
      visible: true,
    })

    if (!spanText) {
      console.log('No se encontró el texto')
      return
    }

    const createDoc = await spanText.evaluateHandle((span) =>
      span.closest('button'),
    )

    if (!createDoc) {
      console.log('No existe create doc')
      return
    }

    const isDisbaled = await this.page.evaluate((button) => {
      return button.disabled
    }, createDoc)

    if (isDisbaled === false) {
      await createDoc.click()
      console.log('Click create document realizado con éxito')
    } else {
      console.log('El botón create documet está deshabilitado')
      await this.clickCreateDocument()
    }
  }

  // async clickCreateDocument() {
  //   const enabled = await this.page
  //     .locator('button')
  //     .map((button) => {
  //       console.log(button)
  //       return button.innerText === 'Crear Documento' && !button.disabled
  //     })
  //     .wait()

  //   if (!enabled) {
  //     console.log('El boton esta deshabilitado')
  //     // this.clickCreateDocument()
  //     return
  //   }

  //   await this.page
  //     .locator('button')
  //     .filter((button) => button.innerText === 'Crear Documento')
  //     .click()

  //   console.log('Click create document realizado con éxito')
  //   // try {
  //   //   // Esperar hasta que el texto "Crear Documento" sea visible
  //   //   const spanText = await this.page.waitForSelector('text/Crear Documento', {
  //   //     visible: true,
  //   //   })
  //   //   if (!spanText) {
  //   //     console.log('No se encontró el texto')
  //   //     return
  //   //   }
  //   //   // Buscar el botón más cercano al texto "Crear Documento"
  //   //   const createDoc = await spanText.evaluateHandle((span) =>
  //   //     span.closest('button'),
  //   //   )
  //   //   if (!createDoc) {
  //   //     console.log('No se encontró el botón')
  //   //     return
  //   //   }
  //   //   // Esperar a que el botón no esté deshabilitado
  //   //   await this.page.waitForFunction(
  //   //     (button) => !button.disabled,
  //   //     {},
  //   //     createDoc,
  //   //   )
  //   //   // Hacer clic usando Puppeteer
  //   //   await createDoc.click()
  //   //   console.log('Click create document realizado con éxito')
  //   // } catch (error) {
  //   //   console.error('Error al intentar hacer clic en el botón:', error)
  //   // }
  // }

  async clickAceptar() {
    try {
      await this.page.waitForSelector('button::-p-text("Aceptar")')
      await this.page.click('button::-p-text("Aceptar")')
      console.log('Click aceptar realizado con éxito')
    } catch (error) {
      console.log(error.message)
    }
  }

  async clickAndWaitForModal() {
    let attempts = 0
    const maxAttempts = 3 // Número máximo de intentos
    const modalSelector = '.modal.show'

    while (attempts < maxAttempts) {
      attempts++

      // Intenta hacer clic en el botón
      await this.clickCreateDocument()

      try {
        // Espera a que el modal aparezca
        await this.page.waitForSelector(modalSelector, {
          visible: true,
          timeout: 1500,
        })
        console.log('Modal visible')
        return // Si se encuentra el modal, termina la función
      } catch (error) {
        console.warn(`Intento ${attempts} fallido: Modal no visible`)
        if (attempts >= maxAttempts) {
          throw new Error(
            'No se pudo abrir el modal después de varios intentos.',
          )
        }
      }
    }
  }

  async createDocument(doc) {
    // await this.clickCreateDocument()

    // await this.page.waitForSelector('.modal.show', { visible: true })
    await this.clickAndWaitForModal()

    const $fileInput = await this.page.$('input[type="file"]')

    if (!$fileInput) {
      console.log('No se encontró el input')
      return
    }

    await $fileInput.uploadFile(doc.path)

    // await this.page.type(
    //   'input[placeholder="Tipo de documento*"]',
    //   'Electrónico',
    // )
    await this.page.evaluate(
      (selector, value) => {
        const textarea = document.querySelector(selector)
        if (textarea) {
          textarea.value = value // Establece el valor directamente
          textarea.dispatchEvent(new Event('input', { bubbles: true })) // Simula un evento de entrada si es necesario
        }
      },
      'input[placeholder="Tipo de documento*"]',
      'Electrónico',
    )
    // await this.page.type('input[placeholder="Nombre documental*"]', 'Memorial')
    await this.page.evaluate(
      (selector, value) => {
        const textarea = document.querySelector(selector)
        if (textarea) {
          textarea.value = value // Establece el valor directamente
          textarea.dispatchEvent(new Event('input', { bubbles: true })) // Simula un evento de entrada si es necesario
        }
      },
      'input[placeholder="Nombre documental*"]',
      nameDocumental(this.formatDocumentName(doc.name)),
    )

    await this.setDateToToday()

    const observation = this.formatDocumentName(doc.name)
    // await this.page.type('textarea[name="observation"]', observation)
    await this.page.evaluate(
      (selector, value) => {
        const textarea = document.querySelector(selector)
        if (textarea) {
          textarea.value = value // Establece el valor directamente
          textarea.dispatchEvent(new Event('input', { bubbles: true })) // Simula un evento de entrada si es necesario
        }
      },
      'textarea[name="observation"]',
      observation,
    )

    await this.clickAceptar()

    await this.page.waitForResponse((response) => {
      return (
        response.url().includes('confirm_uploaded_document') &&
        response.status() === 200
      )
    })
  }

  async setDateToToday() {
    // Espera que el input de tipo date esté disponible
    const dateInput = await this.page.waitForSelector('input[type="date"]')

    // Obtén la fecha de hoy en formato 'YYYY-MM-DD'
    const today = new Date().toISOString().split('T')[0]

    // Establece el valor de la fecha en el input
    await this.page.evaluate(
      (input, value) => {
        input.value = value
        input.dispatchEvent(new Event('input', { bubbles: true })) // Dispara un evento de input si es necesario
      },
      dateInput,
      today,
    )

    console.log(`Fecha establecida a: ${today}`)
  }

  async createAllDocuments(docs) {
    let i = 0
    while (i < docs.length) {
      await this.createDocument(docs[i])
      i++
    }

    console.log('🎉 Todos los documentos han sido subidos')
    this.browser.close()
  }

  formatDocumentName(name) {
    // Elimina la extensión del nombre del archivo
    const nameWithoutExtension = name.replace(/\.[^/.]+$/, '')

    // Elimina los números del nombre del archivo
    const formattedName = nameWithoutExtension.replace(/\d+/g, '')

    return formattedName.trim()
  }
}

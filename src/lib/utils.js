import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// const nameDoc = [
//   'Acta de audiencia de remate',
//   'Acta de audiencia de tramite',
//   'Acta de audiencia inicial',
//   'Acta de audiencia obligatoria de conciliación, decisión de excepciones previas, de saneamiento y fijación del litigio',
//   'Acta de conciliación prejudicial',
//   'Acta de diligencia de allanamiento',
//   'Acta de diligencia de secuestro',
//   'Acta de inspección judicial',
//   'Acta de interrogatorio',
//   'Acta de reparto',
//   'Acta de testimonio',
//   'Acta posesión de curador o perito',
//   'Anexo plano',
//   'Anexos de demanda',
//   'Anexos de poder',
//   'Auto',
//   'Auto abre a pruebas',
//   'Auto abre incidente',
//   'Auto aclara, corrige o adiciona sentencia',
//   'Auto acumulación demanda',
//   'Auto admite demanda',
//   'Auto admite el amparo de pobreza',
//   'Auto admite la demanda de llamamiento en garantía',
//   'Auto admite recurso',
//   'Auto aprueba avalúo',
//   'Auto aprueba liquidación',
//   'Auto aprueba remate',
//   'Auto avoca conocimiento',
//   'Auto de obedézcase y cúmplase',
//   'Auto decide incidente',
//   'Auto decide sobre excepciones',
//   'Auto declara desierto el recurso',
//   'Auto declara nulidad',
//   'Auto decreta medidas cautelares',
//   'Auto decreta pruebas',
//   'Auto decreta secuestro',
//   'Auto designa auxiliar de la justicia',
//   'Auto impone sanción',
//   'Auto inadmite demanda',
//   'Auto libra mandamiento pago',
//   'Auto niega acumulación de proceso',
//   'Auto niega acumulación demanda',
//   'Auto niega mandamiento o se abstiene de mandamiento de pago',
//   'Auto niega medidas cautelares',
//   'Auto nombra curador ad-litem',
//   'Auto ordena acumulación de proceso',
//   'Auto ordena agencias, certificación, copias, revoca poder, reconoce personería',
//   'Auto ordena correr traslado',
//   'Auto ordena correr traslado para alegatos de conclusión',
//   'Auto ordena emplazamiento',
//   'Auto ordena entrega títulos',
//   'Auto ordena exclusión de la lista de auxiliares',
//   'Auto ordena fecha de remate',
//   'Auto ordena la terminación y archivo',
//   'Auto ordena peritaje',
//   'Auto ordena reanudar proceso',
//   'Auto ordena remitir proceso',
//   'Auto ordena seguir adelante la ejecución',
//   'Auto ordena suspensión de proceso',
//   'Auto plantea conflicto de competencia',
//   'Auto que rechaza incidente',
//   'Auto rechaza demanda',
//   'Auto rechaza el amparo de pobreza',
//   'Auto rechaza nulidad',
//   'Auto rechaza prueba',
//   'Auto rechaza recurso',
//   'Auto resuelve desistimiento',
//   'Auto resuelve impedimento',
//   'Auto resuelve objeción',
//   'Auto resuelve recusación',
//   'Auto termina proceso por desistimiento tácito',
//   'Auto termina proceso por pago total de la obligación',
//   'Auto termina proceso por transacción',
//   'Aviso',
//   'Carátula',
// ]

const nameDoc = [
  'Poder',
  'Auto',
  'Memorial',
  'Demanda',
  'Constancia',
  'Caratula',
  'Oficio',
]

export function nameDocumental(name) {
  const findDoc = nameDoc.find((doc) =>
    name.toLowerCase().includes(doc.toLowerCase()),
  )

  if (!findDoc) {
    return 'Memorial'
  }

  return findDoc
}

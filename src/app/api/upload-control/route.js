import { NextResponse } from 'next/server'

export async function POST(request) {
  const formData = await request.formData()

  const expediente = formData.get('expediente')
  const notebook = formData.get('notebook')
  const file = formData.get('file')

  console.log(expediente, notebook, file)

  return NextResponse.json({ expediente, notebook, file })
}

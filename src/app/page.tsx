"use client"

import Link from 'next/link'
import { useState } from 'react'

export default function ProfilePage() {
  const [profile] = useState({
    nome: 'Usuário Exemplo',
    cpf: '123.456.789-00',
  })

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Perfil</h1>
      <div className="mb-4">
        <div><span className="font-semibold">Nome:</span> {profile.nome}</div>
        <div><span className="font-semibold">CPF:</span> {profile.cpf}</div>
      </div>
      <div className="mb-4">
        <Link href="/address" className="text-blue-600 underline mr-4">Endereços</Link>
      </div>
    </div>
  )
}
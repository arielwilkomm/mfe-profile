import * as React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ProfileInfo } from './components/ProfileInfo';
import { AddressInfo } from './components/AddressInfo';
import { PostalCodeInfo } from './components/PostalCodeInfo';
import { Button } from './components/ui/button';

export function App() {
  return (
    <BrowserRouter>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Olá, MFE Profile!</h1>
        <Button onClick={() => alert('Botão clicado!')}>Clique aqui</Button>
        <nav className="mb-4 flex gap-4">
          <Link to="/" className="text-blue-600">Perfil</Link>
          <Link to="/enderecos" className="text-green-600">Endereços</Link>
          <Link to="/cep" className="text-purple-600">CEP</Link>
        </nav>
        <div className="mt-8">
          <Routes>
            <Route path="/" element={<ProfileInfo />} />
            <Route path="/enderecos" element={<AddressInfo />} />
            <Route path="/cep" element={<PostalCodeInfo />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

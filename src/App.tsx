import * as React from 'react';
import { Button } from './components/ui/button';

export function App() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Olá, MFE Profile!</h1>
      <Button onClick={() => alert('Botão clicado!')}>Clique aqui</Button>
    </div>
  );
}

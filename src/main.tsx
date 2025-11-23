/**
 * @file Ponto de entrada da aplicação (Entry Point).
 * @description Este arquivo é o ponto de entrada principal da aplicação React.
 * Ele é responsável por renderizar o componente raiz `App` no elemento DOM com o id 'root'.
 * A aplicação é envolvida em `StrictMode` para destacar potenciais problemas.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './app.tsx'

// biome-ignore lint/style/noNonNullAssertion: O elemento 'root' é garantido de existir no index.html.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

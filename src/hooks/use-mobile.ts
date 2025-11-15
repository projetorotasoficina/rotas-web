/**
 * @file Hook para Detecção de Dispositivo Móvel.
 * @description Este arquivo contém o hook `useIsMobile`, que verifica se a largura
 * da janela do navegador corresponde à de um dispositivo móvel, com base em um
 * breakpoint predefinido. É útil para renderizar componentes de forma condicional
 * ou aplicar lógicas específicas para layouts móveis.
 */
// biome-ignore lint/performance/noNamespaceImport: shacnui default
import * as React from 'react'

/**
 * @description O breakpoint em pixels que define a largura máxima para ser considerado "móvel".
 * Telas com largura menor que 768px serão consideradas móveis.
 */
const MOBILE_BREAKPOINT = 768

/**
 * @description Hook que determina se o dispositivo atual é móvel com base na largura da tela.
 * Ele utiliza a API `window.matchMedia` para observar mudanças na largura da tela
 * e atualiza seu estado de acordo.
 *
 * @returns {boolean} Retorna `true` se a largura da tela for menor que o `MOBILE_BREAKPOINT`,
 * e `false` caso contrário. O valor inicial pode ser `undefined` antes da primeira renderização no cliente.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Cria uma media query para o breakpoint definido.
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Função para atualizar o estado com base na correspondência da media query.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Adiciona um listener para reagir a mudanças no tamanho da tela.
    mql.addEventListener('change', onChange)

    // Define o estado inicial na primeira montagem do componente no cliente.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Função de limpeza: remove o listener quando o componente é desmontado.
    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}

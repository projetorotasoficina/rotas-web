/**
 * @file Gerenciamento do Token de Autenticação.
 * @description Este módulo centraliza a lógica para manipulação do token de autenticação (JWT)
 * armazenado no `sessionStorage` do navegador. O uso do `sessionStorage` garante que o token
 * persista durante a sessão da página, mas seja removido quando a aba ou o navegador for fechado.
 */

const TOKEN_KEY = 'token'

/**
 * @description Um objeto que encapsula as operações de CRUD (Create, Read, Update, Delete)
 * para o token de autenticação no `sessionStorage`.
 */
export const tokenStorage = {
  /**
   * @description Recupera o token de autenticação do `sessionStorage`.
   * @returns {string | null} O token armazenado, ou `null` se não houver token.
   */
  get: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY)
  },

  /**
   * @description Armazena o token de autenticação no `sessionStorage`.
   * @param {string} token - O token JWT a ser armazenado.
   */
  set: (token: string): void => {
    sessionStorage.setItem(TOKEN_KEY, token)
  },

  /**
   * @description Remove o token de autenticação do `sessionStorage`.
   * Geralmente chamado durante o processo de logout.
   */
  remove: (): void => {
    sessionStorage.removeItem(TOKEN_KEY)
  },

  /**
   * @description Verifica se um token de autenticação existe no `sessionStorage`.
   * @returns {boolean} `true` se o token existir, `false` caso contrário.
   */
  exists: (): boolean => {
    return sessionStorage.getItem(TOKEN_KEY) !== null
  },
}

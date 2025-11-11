# Documentação de Gerenciamento de Erros

Este documento descreve os padrões e convenções para o gerenciamento de erros no frontend da aplicação.

## 1. Visão Geral

O sistema de gerenciamento de erros foi projetado para fornecer feedback claro, consistente e amigável ao usuário, ao mesmo tempo em que oferece informações detalhadas para os desenvolvedores no console.

A estratégia se baseia em três pilares:
1.  **Erros de API:** Erros que ocorrem durante a comunicação com o servidor.
2.  **Erros de Interface (Runtime):** Erros inesperados que acontecem durante a renderização ou execução de lógica no cliente.
3.  **Erros de Validação de Formulário:** Feedback fornecido quando o usuário insere dados inválidos em um formulário.

## 2. Padrões Implementados

### 2.1. Erros de API

-   **Centralização:** A lógica de tratamento de erros de API está centralizada no arquivo `src/services/api.ts`. As funções `fetchWithAuth` e `fetchWithoutAuth` são responsáveis por capturar respostas de erro do servidor.
-   **Mensagens Padronizadas:** As mensagens de erro exibidas para o usuário são padronizadas e amigáveis. A função `getErrorMessage` em `src/lib/errors.ts` mapeia status HTTP (400, 401, 403, 404, 500, etc.) para mensagens claras.
-   **Log no Console:** Para cada erro de API, uma mensagem detalhada é registrada no console do navegador usando `console.error()`, contendo o status do erro e detalhes técnicos retornados pelo servidor. Isso evita a exposição de informações técnicas ao usuário final.
-   **Exibição Visual:** Erros de API são exibidos como "toasts" (notificações) no canto da tela, utilizando a função `showErrorToast`.

### 2.2. Componente de Toast de Erro (`showErrorToast`)

-   **Componente Padrão:** Foi criada a função `showErrorToast` em `src/lib/toasts.ts` para padronizar a aparência de todos os toasts de erro.
-   **Uso:** Para exibir um toast de erro, importe e chame esta função em vez de usar `toast.error` diretamente.
    ```typescript
    import { showErrorToast } from '@/lib/toasts';
    showErrorToast('Sua mensagem de erro aqui.');
    ```
-   **Padrão Visual:** Todos os toasts de erro incluem um ícone de erro (`CircleX`) e seguem a estilização padrão definida no `Toaster` em `src/app.tsx`.

### 2.3. Fallback de Erros de Interface (`ErrorBoundary`)

-   **Componente de Segurança:** O `ErrorBoundary`, localizado em `src/components/layout/error-boundary.tsx`, atua como uma rede de segurança para erros de runtime inesperados (ex: erros de renderização).
-   **Funcionamento:** Ele envolve a aplicação principal e, caso um erro não tratado ocorra, exibe uma tela de fallback com a mensagem "Algo deu errado" e um botão para recarregar a página.
-   **Log no Console:** Assim como os erros de API, os erros capturados pelo `ErrorBoundary` são registrados no console para facilitar a depuração.

## 3. Como Usar

-   **Para Erros de CRUD:** O hook `useCrudMutation` já está configurado para usar `showErrorToast` automaticamente. Nenhuma ação adicional é necessária na maioria dos casos de criação, atualização ou exclusão.
-   **Para Chamadas de API Manuais:** Se você precisar fazer uma chamada de API fora do `useCrudMutation`, certifique-se de envolvê-la em um bloco `try...catch` e usar `showErrorToast` no `catch`.
    ```typescript
    try {
      // sua lógica de fetch
    } catch (error) {
      const message = error instanceof ApiError ? error.userMessage : 'Ocorreu um erro.';
      showErrorToast(message);
    }
    ```
-   **Para Validações de Formulário:** Continue usando os esquemas `zod` para definir mensagens de validação. As mensagens devem ser curtas e diretas. O componente `<FormMessage />` do `shadcn/ui` as exibirá automaticamente.

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '@/contexts/auth-context'
import { LoadingProvider } from '@/contexts/loading-context'
import * as useSendLoginCode from '@/http/auth/use-send-email-login'
import * as useVerifyLoginCode from '@/http/auth/use-verify-login-code'
import * as apiService from '@/services/api'
import { LoginPage } from './login'

const queryClient = new QueryClient()

const mockNavigate = vi.fn()
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}))

vi.mock('@/http/auth/use-send-email-login')
vi.mock('@/http/auth/use-verify-login-code')

const mockLogin = vi.fn()
vi.mock('@/contexts/auth-context', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/contexts/auth-context')>()
  return {
    ...actual,
    useAuth: () => ({
      ...actual.useAuth(),
      isAuthenticated: false,
      login: mockLogin,
    }),
  }
})

const renderComponent = () => {
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LoadingProvider>
          <LoginPage />
        </LoadingProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock localStorage as AuthProvider uses it
    const storage: Record<string, string> = {}
    vi.spyOn(window.localStorage, 'getItem').mockImplementation(
      (key: string) => storage[key] ?? null
    )
    vi.spyOn(window.localStorage, 'setItem').mockImplementation(
      (key: string, value: string) => {
        storage[key] = value
      }
    )
  })

  it('should successfully complete the login flow', async () => {
    // Mock useSendLoginCode to succeed
    vi.spyOn(useSendLoginCode, 'useSendLoginCode').mockReturnValue({
      mutate: vi.fn((_data, { onSuccess }) => onSuccess()),
      isPending: false,
      reset: vi.fn(),
    } as any)

    // Mock useVerifyLoginCode to succeed
    vi.spyOn(useVerifyLoginCode, 'useVerifyLoginCode').mockReturnValue({
      mutate: vi.fn((_data, { onSuccess }) =>
        onSuccess({ token: 'mock-token' })
      ),
      isPending: false,
      reset: vi.fn(),
    } as any)

    // Mock fetchWithAuth for user profile
    vi.spyOn(apiService, 'fetchWithAuth').mockResolvedValue({
      json: () => Promise.resolve({ email: 'test@example.com', nome: 'Test User', authorities: ['ROLE_USER'] }),
    } as Response)

    renderComponent()

    // Step 1: Submit email
    const emailInput = screen.getByPlaceholderText('nome@exemplo.com')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    await waitFor(() => {
      expect(useSendLoginCode.useSendLoginCode().mutate).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        expect.any(Object)
      )
      expect(
        screen.getByText('Enviamos um código de verificação para test@example.com')
      ).toBeInTheDocument()
    })

    // Step 2: Verify code
    const codeInput = screen.getByLabelText('Código de verificação')
    fireEvent.change(codeInput, { target: { value: '1234' } })
    fireEvent.click(screen.getByRole('button', { name: 'Verificar código' }))

    await waitFor(() => {
      expect(useVerifyLoginCode.useVerifyLoginCode().mutate).toHaveBeenCalledWith(
        { email: 'test@example.com', code: '1234' },
        expect.any(Object)
      )
      expect(apiService.fetchWithAuth).toHaveBeenCalledWith(
        apiService.apiConfig.endpoints.usuarios.meuPerfil
      )
      expect(mockLogin).toHaveBeenCalledWith(
        'mock-token',
        { email: 'test@example.com', nome: 'Test User', authorities: ['ROLE_USER'] }
      )
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true })
    })
  })

  it('should display error message on email submission failure', async () => {
    vi.spyOn(useSendLoginCode, 'useSendLoginCode').mockReturnValue({
      mutate: vi.fn((_data, { onError }) =>
        onError({ status: 404, userMessage: 'Email não encontrado' })
      ),
      isPending: false,
      reset: vi.fn(),
    } as any)

    vi.spyOn(useVerifyLoginCode, 'useVerifyLoginCode').mockReturnValue({
      mutate: vi.fn(),
      isPending: false,
      reset: vi.fn(),
    } as any)

    renderComponent()

    const emailInput = screen.getByPlaceholderText('nome@exemplo.com')
    fireEvent.change(emailInput, { target: { value: 'invalid@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    await waitFor(() => {
      expect(screen.getByText('Email não encontrado, contate o seu administrador')).toBeInTheDocument()
    })
  })

  it('should display error message on code verification failure', async () => {
    vi.spyOn(useSendLoginCode, 'useSendLoginCode').mockReturnValue({
      mutate: vi.fn((_data, { onSuccess }) => onSuccess()),
      isPending: false,
      reset: vi.fn(),
    } as any)

    vi.spyOn(useVerifyLoginCode, 'useVerifyLoginCode').mockReturnValue({
      mutate: vi.fn((_data, { onError }) =>
        onError({ status: 422, userMessage: 'Código inválido' })
      ),
      isPending: false,
      reset: vi.fn(),
    } as any)

    renderComponent()

    // Step 1: Submit email (succeeds)
    const emailInput = screen.getByPlaceholderText('nome@exemplo.com')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))

    await waitFor(() => {
      expect(
        screen.getByText('Enviamos um código de verificação para test@example.com')
      ).toBeInTheDocument()
    })

    // Step 2: Verify code (fails)
    const codeInput = screen.getByLabelText('Código de verificação')
    fireEvent.change(codeInput, { target: { value: 'wrongcode' } })
    fireEvent.click(screen.getByRole('button', { name: 'Verificar código' }))

    await waitFor(() => {
      expect(screen.getByText('Código inválido ou expirado')).toBeInTheDocument()
    })
  })
})

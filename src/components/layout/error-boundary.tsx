import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      // biome-ignore lint/suspicious/noConsole: útil para debug de erros em desenvolvimento
      console.error('Error Boundary caught an error:', error, errorInfo)
    }
    // You can integrate with an error reporting service here if needed
    // Example: Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center">
          <div className="space-y-4">
            <h1 className="font-bold text-4xl text-destructive">
              Algo deu errado.
            </h1>
            <p className="text-muted-foreground">
              Ocorreu um erro inesperado. Por favor, tente recarregar a página.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <div className="mx-auto max-w-2xl space-y-2 rounded-md bg-destructive/10 p-4 text-left">
                <p className="font-semibold text-destructive text-sm">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="overflow-auto font-mono text-destructive/80 text-xs">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}
            <div className="flex justify-center">
              <Button onClick={() => window.location.reload()}>
                Recarregar Página
              </Button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

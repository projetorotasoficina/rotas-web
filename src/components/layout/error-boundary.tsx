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

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // You can integrate with an error reporting service here if needed
    // Example: Sentry.captureException(_error, { contexts: { react: { componentStack: _errorInfo.componentStack } } })
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
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
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mx-auto max-w-2xl rounded-md bg-destructive/10 p-4 text-left">
                <p className="font-mono text-destructive text-sm">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="flex justify-center gap-4">
              <Button onClick={this.handleReset} variant="outline">
                Tentar Novamente
              </Button>
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

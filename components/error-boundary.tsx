/**
 * Error Boundary Component para capturar erros de renderização em React
 *
 * Este componente implementa o padrão Error Boundary do React para capturar
 * erros em componentes-filho e renderizar UI de fallback.
 *
 * @module components/error-boundary
 */

'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

/**
 * Props do ErrorBoundary
 */
interface ErrorBoundaryProps {
  /** Componente UI a ser renderizado quando ocorre erro */
  fallback: ReactNode;
  /** Callback chamado quando um erro é capturado */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** Filhos normais do componente */
  children: ReactNode;
}

/**
 * Estado do ErrorBoundary
 */
interface ErrorBoundaryState {
  /** Indica se há erro ativo */
  hasError: boolean;
  /** Erro capturado */
  error?: Error;
}

/**
 * ErrorBoundary é um componente React que captura erros de renderização
 * em componentes-filho e renderiza uma UI alternativa.
 *
 * Deve ser usado para envolver componentes que podem falhar durante renderização,
 * como componentes assíncronos, componentes com dados externos, etc.
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={<div>Algo deu errado</div>}
 *   onError={(error) => console.error(error)}
 * >
 *   <ComponenteQuePodeFalhar />
 * </ErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={<ErrorFallback />}
 * >
 *   <Produtos lista={produtos} />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /**
   * Atualiza o estado para indicar erro e renderizar fallback
   *
   * @param error - O erro que foi lançado
   * @returns Novo estado com hasError: true
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * Lifecycle method que captura informações adicionais do erro
   *
   * @param error - O erro que foi lançado
   * @param errorInfo - Informações adicionais sobre o erro
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log do erro no console para debugging
    console.error('[ErrorBoundary] Erro capturado:', error);
    console.error('[ErrorBoundary] Info do erro:', errorInfo);

    // Callback opcional para handling customizado
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Reseta o estado do ErrorBoundary para permitir re-renderização
   *
   * Após chamar este método, o componente tentará renderizar os filhos novamente.
   */
  reset(): void {
    this.setState({
      hasError: false,
      error: undefined,
    });
  }

  render(): ReactNode {
    const { hasError, error } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      // Renderiza fallback com accessibilidade ao erro
      if (typeof fallback === 'function') {
        return fallback as ReactNode;
      }
      return (
        <div
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          data-error-boundary="true"
          data-error-message={error?.message}
        >
          {fallback}
        </div>
      );
    }

    return children;
  }
}

/**
 * Hook helper para resetar ErrorBoundary de fora
 *
 * @example
 * ```tsx
 * const { resetError, error } = useErrorBoundary();
 *
 * return (
 *   <ErrorBoundary ref={resetError} fallback={<div>Erro: {error?.message}</div>}>
 *     <Content />
 *   </ErrorBoundary>
 * );
 * ```
 */
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    resetError,
    hasError: error !== null,
  };
}

/**
 * Componente de fallback padrão para uso com ErrorBoundary
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<DefaultErrorFallback />}>
 *   <Content />
 * </ErrorBoundary>
 * ```
 */
export function DefaultErrorFallback({
  title = 'Algo deu errado',
  message = 'Ocorreu um erro inesperado. Por favor, tente novamente.',
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        minHeight: '200px',
        backgroundColor: '#fef2f2',
        borderRadius: '8px',
        border: '1px solid #fecaca',
      }}
      role="alert"
    >
      <div
        style={{
          fontSize: '2rem',
          marginBottom: '1rem',
        }}
      >
        ⚠️
      </div>
      <h2
        style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#991b1b',
          marginBottom: '0.5rem',
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: '0.875rem',
          color: '#b91c1c',
          marginBottom: '1rem',
        }}
      >
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#dc2626',
            color: 'white',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}

/**
 * Wrapper component para ErrorBoundary com retry automático
 *
 * @example
 * ```tsx
 * <ErrorBoundaryWithRetry
 *   fallback={<DefaultErrorFallback />}
 *   maxRetries={3}
 *   retryDelay={1000}
 * >
 *   <AsyncContent />
 * </ErrorBoundaryWithRetry>
 * ```
 */
interface ErrorBoundaryWithRetryProps extends ErrorBoundaryProps {
  maxRetries?: number;
  retryDelay?: number;
}

interface ErrorBoundaryWithRetryState extends ErrorBoundaryState {
  retryCount: number;
}

export class ErrorBoundaryWithRetry extends Component<
  ErrorBoundaryWithRetryProps,
  ErrorBoundaryWithRetryState
> {
  constructor(props: ErrorBoundaryWithRetryProps) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundaryWithRetry] Erro capturado:', error);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetWithRetry = (): void => {
    const { retryDelay = 1000 } = this.props;
    setTimeout(() => {
      this.setState((prevState) => ({
        hasError: false,
        error: undefined,
        retryCount: prevState.retryCount + 1,
      }));
    }, retryDelay);
  };

  render(): ReactNode {
    const { hasError, retryCount } = this.state;
    const { fallback, children, maxRetries = 3 } = this.props;

    if (hasError) {
      const canRetry = retryCount < maxRetries;
      const retryFallback = React.isValidElement(fallback)
        ? React.cloneElement(fallback as React.ReactElement<{ onRetry?: () => void }>, {
            onRetry: canRetry ? this.resetWithRetry : undefined,
          })
        : fallback;

      return (
        <div role="alert" data-error-boundary="true" data-retry-count={retryCount}>
          {retryFallback}
        </div>
      );
    }

    return children;
  }
}

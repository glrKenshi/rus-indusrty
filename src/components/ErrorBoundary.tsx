import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    console.error("[ErrorBoundary] Ошибка приложения:", error.message, error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <img
                src="/404русиндус.png"
                alt="Ошибка загрузки"
                className="w-full max-w-md mx-auto mb-8"
              />
              <h1 className="mb-4 text-4xl lg:text-5xl font-bold text-foreground">
                Произошла ошибка
              </h1>
              <p className="mb-6 text-xl text-muted-foreground">
                К сожалению, произошла ошибка при загрузке страницы. Пожалуйста, попробуйте обновить страницу.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glow-lime transition-all duration-300 font-medium mb-4"
              >
                Обновить страницу
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="inline-flex items-center px-6 py-3 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300 font-medium ml-4"
              >
                Вернуться на главную
              </button>
              {(this.state.error?.message || this.state.errorInfo) && (
                <details className="mt-8 text-left max-w-2xl mx-auto">
                  <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                    Подробности ошибки (для отладки)
                  </summary>
                  <pre className="mt-2 p-4 rounded bg-muted text-muted-foreground text-xs overflow-auto">
                    {this.state.error?.message}
                    {this.state.error?.stack && `\n\n${this.state.error.stack}`}
                    {this.state.errorInfo?.componentStack && `\n\n${this.state.errorInfo.componentStack}`}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;


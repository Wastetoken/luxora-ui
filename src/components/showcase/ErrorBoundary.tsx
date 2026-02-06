import React from "react";

interface Props {
  children: React.ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ComponentErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-full p-8">
          <div className="text-center max-w-md">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-destructive text-xl">!</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {this.props.componentName || "Component"} failed to render
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

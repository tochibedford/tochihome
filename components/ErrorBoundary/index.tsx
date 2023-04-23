import React from "react"

type IErrorBoundary = {
    fallback: React.ReactNode
    children: React.ReactNode
}

class ErrorBoundary extends React.Component<IErrorBoundary> {
    state = { hasError: false }

    static getDerivedStateFromError(_error: Error) {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.log(error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback
        }

        return this.props.children
    }
}

export default ErrorBoundary
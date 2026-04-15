import React, { type ReactNode } from "react";

import Logo from "@/assets/react.svg";
import { Button } from "@/components/ui/button";

type children = { children: ReactNode };

function FallbackComponent() {
  return (
    <div className="flex w-screen h-screen justify-center items-center">
      <img src={Logo} alt="error_logo" className="w-20 mr-8" />
      <div>
        <p className="text-lg font-semibold">Something went wrong.</p>
        <p>Please refresh the page or try again later.</p>
        <div className="flex space-x-2 mt-2">
          <Button onClick={() => (window.location.href = "/")} content="Home" />
          <Button onClick={() => window.location.reload()} content="Refresh" />
        </div>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component<children, { hasError: boolean }> {
  constructor(props: children) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackComponent />;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

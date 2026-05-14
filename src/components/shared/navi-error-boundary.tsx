"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

export class NaviErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[Navi]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-16 text-center backdrop-blur-xl">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/10">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <h2 className="font-display text-2xl text-text-high">
            {this.props.fallbackTitle ?? "Something went sideways"}
          </h2>
          <p className="mt-2 max-w-md text-sm text-text-mid">
            Navi hit a snag loading this view. Your data is safe — try refreshing
            or head back to the dashboard.
          </p>
          <Button
            type="button"
            onClick={this.handleReset}
            className="mt-6 rounded-full bg-accent text-primary hover:bg-accent/90"
          >
            Refresh page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

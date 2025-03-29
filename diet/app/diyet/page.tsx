"use client";
import React, { ErrorInfo } from "react";
import DietForm from "@/components/DietForm";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 max-w-lg mx-auto my-8 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-lg font-bold text-red-700 mb-2">
            Bir sorun oluştu
          </h2>
          <p className="text-red-600 mb-4">
            {this.state.error?.message || "Beklenmeyen bir hata oluştu."}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sayfayı Yenile
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function DietPage() {
  return (
    <ErrorBoundary>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DietForm />
      </div>
    </ErrorBoundary>
  );
}

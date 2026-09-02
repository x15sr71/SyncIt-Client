"use client";

import type React from "react";

import { Check } from "lucide-react";

interface Step {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface StepsProgressProps {
  steps: Step[];
  currentStep: number;
  getStepStatus: (stepIndex: number) => "complete" | "current" | "upcoming";
}

export function StepsProgress({
  steps,
  currentStep,
  getStepStatus,
}: StepsProgressProps) {
  return (
    <div className="mb-12">
      <div className="flex items-start justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <div
              key={index}
              className="flex items-center flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                    status === "complete"
                      ? "bg-brand-50 text-brand-700 border border-brand-200"
                      : status === "current"
                        ? "bg-gradient-to-br from-brand-gradStart to-brand-gradEnd text-white shadow-soft"
                        : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {status === "complete" ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <div className="mt-3 text-center">
                  <p className="text-foreground font-medium text-sm">
                    {step.title}
                  </p>
                  <p className="text-muted-foreground text-xs mt-1 max-w-32">
                    {step.description}
                  </p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-4 rounded transition-all duration-300 ${
                    index < currentStep
                      ? "bg-gradient-to-r from-brand-300 to-brand-200"
                      : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

"use client"

import type React from "react"

import { Check } from "lucide-react"

interface Step {
  title: string
  description: string
  icon: React.ReactNode
}

interface StepsProgressProps {
  steps: Step[]
  currentStep: number
  getStepStatus: (stepIndex: number) => "complete" | "current" | "upcoming"
}

export function StepsProgress({ steps, currentStep, getStepStatus }: StepsProgressProps) {
  return (
    <div className="mb-12">
      <div className="flex items-center justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => {
          const status = getStepStatus(index)
          return (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-300 ${
                    status === "complete"
                      ? "step-complete"
                      : status === "current"
                        ? "step-current animate-pulse"
                        : "step-upcoming"
                  }`}
                >
                  {status === "complete" ? <Check className="w-6 h-6" /> : index + 1}
                </div>
                <div className="mt-3 text-center">
                  <p className="text-white font-medium text-sm">{step.title}</p>
                  <p className="text-white/70 text-xs mt-1 max-w-32">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-24 h-1 mx-4 rounded transition-all duration-300 ${
                    index < currentStep ? "step-line" : "bg-white/20"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

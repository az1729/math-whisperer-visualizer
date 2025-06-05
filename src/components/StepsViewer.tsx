
import React from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Step {
  step: number;
  formula: string;
  explanation: string;
}

interface Calculation {
  operation: string;
  base: number;
  value: number;
  result: number;
  steps: Step[];
}

interface StepsViewerProps {
  calculation: Calculation;
  onClose: () => void;
}

const StepsViewer: React.FC<StepsViewerProps> = ({ calculation, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold">
              Step-by-Step Solution
            </CardTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-green-100">
            {calculation.operation === 'log' 
              ? `log₍${calculation.base}₎(${calculation.value})`
              : `antilog₍${calculation.base}₎(${calculation.value})`
            } = {calculation.result.toFixed(6)}
          </p>
        </CardHeader>
        
        <CardContent className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6">
            {calculation.steps.map((step, index) => (
              <div
                key={step.step}
                className="relative animate-slide-in-right"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    {/* Formula */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <code className="text-lg font-mono text-gray-800">
                        {step.formula}
                      </code>
                    </div>
                    
                    {/* Explanation */}
                    <p className="text-gray-600 leading-relaxed">
                      {step.explanation}
                    </p>
                  </div>
                </div>
                
                {/* Arrow to next step */}
                {index < calculation.steps.length - 1 && (
                  <div className="flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Final Result */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 text-center">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Final Answer
              </h3>
              <p className="text-2xl font-bold text-green-700">
                {calculation.result.toFixed(6)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepsViewer;

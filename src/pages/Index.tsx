
import React, { useState } from 'react';
import { Calculator, BookOpen, Eye, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import StepsViewer from '@/components/StepsViewer';
import LogTableViewer from '@/components/LogTableViewer';

const Index = () => {
  const [operation, setOperation] = useState('log');
  const [base, setBase] = useState('10');
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [showSteps, setShowSteps] = useState(false);
  const [showLogBook, setShowLogBook] = useState(false);
  const [calculation, setCalculation] = useState(null);

  const calculateResult = () => {
    const baseNum = parseFloat(base);
    const valueNum = parseFloat(value);
    
    if (isNaN(baseNum) || isNaN(valueNum) || baseNum <= 0 || baseNum === 1 || valueNum <= 0) {
      setResult('Invalid input');
      return;
    }

    let calculatedResult;
    let steps = [];
    
    if (operation === 'log') {
      calculatedResult = Math.log(valueNum) / Math.log(baseNum);
      steps = generateLogSteps(baseNum, valueNum, calculatedResult);
    } else {
      calculatedResult = Math.pow(baseNum, valueNum);
      steps = generateAntilogSteps(baseNum, valueNum, calculatedResult);
    }

    setResult(calculatedResult);
    setCalculation({
      operation,
      base: baseNum,
      value: valueNum,
      result: calculatedResult,
      steps
    });
  };

  const generateLogSteps = (base, value, result) => {
    return [
      {
        step: 1,
        formula: `log_${base}(${value}) = ?`,
        explanation: `We need to find the logarithm of ${value} with base ${base}`
      },
      {
        step: 2,
        formula: `log_${base}(${value}) = ln(${value}) / ln(${base})`,
        explanation: 'Using change of base formula: log_a(b) = ln(b) / ln(a)'
      },
      {
        step: 3,
        formula: `ln(${value}) ≈ ${Math.log(value).toFixed(6)}`,
        explanation: `Calculate the natural logarithm of ${value}`
      },
      {
        step: 4,
        formula: `ln(${base}) ≈ ${Math.log(base).toFixed(6)}`,
        explanation: `Calculate the natural logarithm of ${base}`
      },
      {
        step: 5,
        formula: `${Math.log(value).toFixed(6)} / ${Math.log(base).toFixed(6)} = ${result.toFixed(6)}`,
        explanation: 'Divide the natural logarithms to get the final result'
      }
    ];
  };

  const generateAntilogSteps = (base, value, result) => {
    return [
      {
        step: 1,
        formula: `antilog_${base}(${value}) = ${base}^${value}`,
        explanation: `Antilog is the inverse of logarithm: antilog_a(x) = a^x`
      },
      {
        step: 2,
        formula: `${base}^${value} = e^(${value} × ln(${base}))`,
        explanation: 'Convert to exponential form using natural logarithm'
      },
      {
        step: 3,
        formula: `ln(${base}) ≈ ${Math.log(base).toFixed(6)}`,
        explanation: `Calculate the natural logarithm of the base ${base}`
      },
      {
        step: 4,
        formula: `${value} × ${Math.log(base).toFixed(6)} = ${(value * Math.log(base)).toFixed(6)}`,
        explanation: 'Multiply the exponent by the natural logarithm of the base'
      },
      {
        step: 5,
        formula: `e^${(value * Math.log(base)).toFixed(6)} = ${result.toFixed(6)}`,
        explanation: 'Calculate the exponential to get the final result'
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Math Whisperer Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Interactive Logarithm Calculator with Step-by-Step Solutions
          </p>
        </div>

        {/* Main Calculator Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calculator className="w-6 h-6" />
              Logarithm Calculator
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Operation Selection */}
            <div className="space-y-2">
              <Label htmlFor="operation" className="text-sm font-medium text-gray-700">
                Operation Type
              </Label>
              <Select value={operation} onValueChange={setOperation}>
                <SelectTrigger className="w-full h-12 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                  <SelectValue />
                  <ChevronDown className="w-4 h-4" />
                </SelectTrigger>
                <SelectContent className="bg-white border-2 border-gray-200 shadow-lg">
                  <SelectItem value="log" className="hover:bg-purple-50">
                    Logarithm (log)
                  </SelectItem>
                  <SelectItem value="antilog" className="hover:bg-blue-50">
                    Antilogarithm (antilog)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="base" className="text-sm font-medium text-gray-700">
                  Base (default: 10)
                </Label>
                <Input
                  id="base"
                  type="number"
                  value={base}
                  onChange={(e) => setBase(e.target.value)}
                  className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors"
                  placeholder="Enter base..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="value" className="text-sm font-medium text-gray-700">
                  {operation === 'log' ? 'Value' : 'Exponent'}
                </Label>
                <Input
                  id="value"
                  type="number"
                  step="any"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="h-12 border-2 border-gray-200 hover:border-purple-300 focus:border-purple-500 transition-colors"
                  placeholder="Enter value..."
                />
              </div>
            </div>

            {/* Calculate Button */}
            <Button
              onClick={calculateResult}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold text-lg transition-all duration-300 transform hover:scale-[1.02]"
              disabled={!value || !base}
            >
              Calculate
            </Button>

            {/* Result Display */}
            {result !== null && (
              <div className="space-y-4 animate-fade-in">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">Result:</p>
                    <p className="text-2xl font-bold text-green-700">
                      {typeof result === 'number' ? result.toFixed(6) : result}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                {typeof result === 'number' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Button
                      onClick={() => setShowSteps(true)}
                      variant="outline"
                      className="h-12 border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-300"
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      View Steps
                    </Button>
                    <Button
                      onClick={() => setShowLogBook(true)}
                      variant="outline"
                      className="h-12 border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Visual Log Book
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Steps Viewer Modal */}
        {showSteps && calculation && (
          <StepsViewer
            calculation={calculation}
            onClose={() => setShowSteps(false)}
          />
        )}

        {/* Log Table Viewer Modal */}
        {showLogBook && calculation && (
          <LogTableViewer
            calculation={calculation}
            onClose={() => setShowLogBook(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;

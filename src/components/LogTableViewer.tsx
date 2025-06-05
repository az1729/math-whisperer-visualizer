
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Calculation {
  operation: string;
  base: number;
  value: number;
  result: number;
}

interface LogTableViewerProps {
  calculation: Calculation;
  onClose: () => void;
}

const LogTableViewer: React.FC<LogTableViewerProps> = ({ calculation, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedCell, setHighlightedCell] = useState({ row: -1, col: -1 });

  // Generate log table data
  const generateLogTable = () => {
    const table = [];
    const rows = 10; // 1.0 to 9.9
    const cols = 10; // .0 to .9
    
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < cols; j++) {
        const num = parseFloat((1 + i + j / 10).toFixed(1));
        const logValue = Math.log10(num);
        row.push({
          number: num,
          logValue: logValue,
          displayValue: logValue.toFixed(4)
        });
      }
      table.push(row);
    }
    return table;
  };

  const logTable = generateLogTable();

  // Find the closest value in the table
  const findClosestValue = () => {
    let closestDiff = Infinity;
    let closestCell = { row: 0, col: 0 };
    
    const targetValue = calculation.operation === 'log' ? calculation.value : calculation.result;
    
    logTable.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const diff = Math.abs(cell.number - targetValue);
        if (diff < closestDiff) {
          closestDiff = diff;
          closestCell = { row: rowIndex, col: colIndex };
        }
      });
    });
    
    return closestCell;
  };

  const steps = [
    {
      title: "Understanding the Log Table",
      description: "This is a standard logarithm table showing log₁₀ values for numbers 1.0 to 9.9"
    },
    {
      title: "Locating Your Value",
      description: `We need to find ${calculation.operation === 'log' ? calculation.value : calculation.result.toFixed(3)} in the table`
    },
    {
      title: "Reading the Result",
      description: `The corresponding logarithm value helps us understand the calculation`
    }
  ];

  useEffect(() => {
    if (currentStep === 1) {
      const closest = findClosestValue();
      setHighlightedCell(closest);
    } else {
      setHighlightedCell({ row: -1, col: -1 });
    }
  }, [currentStep]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="w-full max-w-6xl max-h-[95vh] overflow-hidden shadow-2xl">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6" />
              Visual Log Table
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
          <p className="text-blue-100">
            Interactive logarithm table visualization
          </p>
        </CardHeader>
        
        <CardContent className="p-6 space-y-4">
          {/* Step Navigation */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </h3>
              <div className="flex gap-1">
                <Button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0 text-xs"
                >
                  <ChevronLeft className="w-3 h-3" />
                </Button>
                <Button
                  onClick={nextStep}
                  disabled={currentStep === steps.length - 1}
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0 text-xs"
                >
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <p className="text-gray-600">
              {steps[currentStep].description}
            </p>
          </div>

          {/* Log Table with ScrollArea */}
          <div className="bg-white rounded-lg border border-gray-300">
            <ScrollArea className="h-80 w-full">
              <div className="min-w-full">
                <table className="w-full border-collapse border border-gray-300 text-xs bg-white">
                  <thead className="sticky top-0 bg-white z-10 hidden sm:table-header-group">
                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <th className="border border-gray-300 p-2 font-semibold">N</th>
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(col => (
                        <th key={col} className="border border-gray-300 p-2 font-semibold">
                          .{col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {logTable.map((row, rowIndex) => (
                      <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                        <th className="border border-gray-300 p-2 bg-gray-50 font-semibold">
                          {(1 + rowIndex).toFixed(1).substring(0, 1)}.{rowIndex}
                        </th>
                        {row.map((cell, colIndex) => (
                          <td
                            key={colIndex}
                            className={`border border-gray-300 p-2 text-center transition-all duration-300 ${
                              highlightedCell.row === rowIndex && highlightedCell.col === colIndex
                                ? 'bg-gradient-to-r from-yellow-200 to-orange-200 font-bold text-orange-800 scale-105 shadow-lg'
                                : 'hover:bg-blue-50'
                            }`}
                          >
                            {cell.displayValue}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollArea>
          </div>

          {/* Calculation Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Your Calculation</h4>
              <p className="text-blue-700">
                {calculation.operation === 'log' 
                  ? (
                    <>log<sub>{calculation.base}</sub>({calculation.value}) = {calculation.result.toFixed(4)}</>
                  )
                  : (
                    <>{calculation.base}<sup>{calculation.value}</sup> = {calculation.result.toFixed(4)}</>
                  )
                }
              </p>
            </div>
            
            {highlightedCell.row >= 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 animate-fade-in">
                <h4 className="font-semibold text-orange-800 mb-2">Closest Table Value</h4>
                <p className="text-orange-700">
                  Number: {logTable[highlightedCell.row][highlightedCell.col].number}<br/>
                  log<sub>10</sub>: {logTable[highlightedCell.row][highlightedCell.col].displayValue}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogTableViewer;

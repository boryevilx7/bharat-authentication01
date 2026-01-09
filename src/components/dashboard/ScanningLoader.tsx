import { Loader2, Shield, Eye, Brain, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useEffect, useState } from 'react';

const scanStages = [
  { icon: Shield, label: 'Initializing scan...', progress: 20 },
  { icon: Eye, label: 'Running visual analysis...', progress: 40 },
  { icon: FileText, label: 'Performing NLP analysis...', progress: 60 },
  { icon: Brain, label: 'ML threat assessment...', progress: 80 },
  { icon: Shield, label: 'Finalizing results...', progress: 100 },
];

export function ScanningLoader() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < scanStages.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800); // 5 stages * 800ms = 4 seconds total

    return () => clearInterval(interval);
  }, []);

  const CurrentIcon = scanStages[currentStage].icon;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scanning in Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <CurrentIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary" />
          </div>
          <p className="mt-4 text-lg font-medium">{scanStages[currentStage].label}</p>
        </div>

        <div className="space-y-2">
          <Progress value={scanStages[currentStage].progress} className="h-2" />
          <p className="text-sm text-muted-foreground text-center">
            {scanStages[currentStage].progress}% complete
          </p>
        </div>

        <div className="space-y-2">
          {scanStages.map((stage, idx) => {
            const StageIcon = stage.icon;
            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  idx <= currentStage ? 'bg-primary/10' : 'opacity-40'
                }`}
              >
                <StageIcon className="h-4 w-4" />
                <span className="text-sm">{stage.label}</span>
                {idx < currentStage && (
                  <span className="ml-auto text-green-600 text-xs">✓</span>
                )}
                {idx === currentStage && (
                  <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

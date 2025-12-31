import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { mockApi, ThreatFeedItem, ScanResult } from '@/utils/mockApi';
import { AlertTriangle, Shield, Activity, ChevronRight } from 'lucide-react';

interface ThreatFeedProps {
  onThreatClick?: (scanResult: ScanResult) => void;
}

export function ThreatFeed({ onThreatClick }: ThreatFeedProps) {
  const [threats, setThreats] = useState<ThreatFeedItem[]>([]);

  useEffect(() => {
    // Initialize with some threats
    const initialThreats = Array.from({ length: 5 }, () => mockApi.generateThreatFeedItem());
    setThreats(initialThreats);

    // Add new threats periodically
    const interval = setInterval(() => {
      const newThreat = mockApi.generateThreatFeedItem();
      setThreats((prev) => [newThreat, ...prev].slice(0, 20));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500 hover:bg-red-600';
      case 'high':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'medium':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'detection':
        return <AlertTriangle className="h-4 w-4" />;
      case 'alert':
        return <Shield className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Live Threat Feed</CardTitle>
        <CardDescription>Real-time security events and detections</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {threats.map((threat) => (
              <button
                key={threat.id}
                onClick={() => threat.scanResult && onThreatClick?.(threat.scanResult)}
                className="w-full flex items-start space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer text-left group"
              >
                <div className="mt-0.5">{getTypeIcon(threat.type)}</div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{threat.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {threat.timestamp.toLocaleTimeString()}
                  </p>
                  {threat.scanResult && (
                    <p className="text-xs text-muted-foreground">
                      Target: {threat.scanResult.target}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={getSeverityColor(threat.severity)}>
                    {threat.severity}
                  </Badge>
                  {threat.scanResult && (
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

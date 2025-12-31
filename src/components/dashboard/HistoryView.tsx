import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScanResult, getThreatLevel, getThreatColor } from '@/utils/mockApi';
import { ExternalLink, FileText, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface HistoryViewProps {
  history: ScanResult[];
  onSelectScan: (scan: ScanResult) => void;
  onRemoveScan?: (id: string) => void;
}

export function HistoryView({ history, onSelectScan, onRemoveScan }: HistoryViewProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scan History</CardTitle>
          <CardDescription>No scans performed yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <FileText className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No scan history</p>
            <p className="text-sm">Start scanning URLs or files to build your history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan History</CardTitle>
        <CardDescription>{history.length} scans performed</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[600px] pr-4">
          <div className="space-y-4">
            {history.map((scan) => (
              <div
                key={scan.id}
                className="flex items-start justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                onClick={() => onSelectScan(scan)}
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center space-x-2">
                    {scan.type === 'url' ? (
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium text-sm">{scan.target}</span>
                    <Badge variant="outline" className="text-xs">
                      {scan.type}
                    </Badge>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>{scan.timestamp.toLocaleString()}</span>
                    <span className={getThreatColor(scan.threatScore.overall)}>
                      {getThreatLevel(scan.threatScore.overall)} threat
                    </span>
                  </div>
                </div>

                {onRemoveScan && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveScan(scan.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

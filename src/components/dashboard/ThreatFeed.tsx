import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { threatAnalysisApi } from '@/lib/api';
import { ThreatFeedItem, ScanResult } from '@/utils/mockApi';
import { AlertTriangle, Shield, Activity, ChevronRight } from 'lucide-react';

interface ThreatFeedProps {
  onThreatClick?: (scanResult: ScanResult) => void;
}

export function ThreatFeed({ onThreatClick }: ThreatFeedProps) {
  const [threats, setThreats] = useState<ThreatFeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadThreatFeed = async () => {
      try {
        setLoading(true);
        const initialThreats = await threatAnalysisApi.getThreatFeed();
        setThreats(initialThreats);
      } catch (error) {
        console.error('Error loading threat feed:', error);
        // Fallback to mock data
        const initialThreats: ThreatFeedItem[] = Array.from({ length: 5 }, () => {
          // Generate mock threat feed item
          const types: ThreatFeedItem['type'][] = ['detection', 'scan', 'alert'];
          const severities: ThreatFeedItem['severity'][] = ['low', 'medium', 'high', 'critical'];
          
          const urls = [
            'https://paypa1-secure.com',
            'https://amazn-account.net',
            'https://microsft-login.com',
            'https://googl-verify.info',
            'https://app1e-id.com'
          ];

          const fileNames = [
            'invoice_2024.apk',
            'banking_app.exe',
            'payment_receipt.pdf.exe',
            'tax_document.scr',
            'update_installer.apk'
          ];
          
          const messages = [
            'Phishing attempt detected from suspicious domain',
            'Malware signature found in uploaded file',
            'URL scan completed - no threats detected',
            'High similarity to known fraudulent site detected',
            'Suspicious redirect chain identified',
            'Data harvesting script detected in webpage',
            'Typosquatting domain flagged for review'
          ];

          const severity = severities[Math.floor(Math.random() * severities.length)];
          const type = types[Math.floor(Math.random() * types.length)];
          const isUrl = Math.random() > 0.5;

          const threatScore = {
            overall: severity === 'critical' ? 80 + Math.random() * 20 : 
                     severity === 'high' ? 60 + Math.random() * 20 :
                     severity === 'medium' ? 30 + Math.random() * 30 :
                     Math.random() * 30,
            phishing: Math.random() * 100,
            malware: Math.random() * 100,
            fraudulent: Math.random() * 100
          };

          return {
            id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            message: messages[Math.floor(Math.random() * messages.length)],
            severity,
            timestamp: new Date(),
            scanResult: {
              id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              type: isUrl ? 'url' : 'file',
              target: isUrl ? urls[Math.floor(Math.random() * urls.length)] : fileNames[Math.floor(Math.random() * fileNames.length)],
              timestamp: new Date(),
              threatScore,
              status: 'completed',
              computerVision: {
                similarity: Math.random() * 100,
                matchedBrands: ['PayPal', 'Amazon', 'Microsoft'].slice(0, Math.floor(Math.random() * 3) + 1),
                suspiciousElements: ['fake login form', 'typosquatting', 'suspicious redirect'].slice(0, Math.floor(Math.random() * 3) + 1)
              },
              nlpAnalysis: {
                sentiment: Math.random() > 0.5 ? 'negative' : 'suspicious',
                keywords: ['urgent', 'verify', 'account', 'password'].slice(0, Math.floor(Math.random() * 4) + 2),
                redFlags: ['urgency language', 'spelling errors', 'suspicious links'].slice(0, Math.floor(Math.random() * 3) + 1)
              },
              mlConfidence: Math.random() * 100
            }
          };
        });
        setThreats(initialThreats);
      } finally {
        setLoading(false);
      }
    };

    loadThreatFeed();

    // Refresh threat feed periodically
    const interval = setInterval(async () => {
      try {
        const newThreats = await threatAnalysisApi.getThreatFeed();
        setThreats(prev => [...newThreats, ...prev].slice(0, 20)); // Keep only latest 20
      } catch (error) {
        console.error('Error refreshing threat feed:', error);
      }
    }, 10000); // Refresh every 10 seconds

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

  if (loading && threats.length === 0) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Live Threat Feed</CardTitle>
          <CardDescription>Real-time security events and detections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p>Loading threat feed...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
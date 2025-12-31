import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './layout/Sidebar';
import { Header } from './layout/Header';
import { MetricCard } from './dashboard/MetricCard';
import { ThreatFeed } from './dashboard/ThreatFeed';
import { ScanPanel } from './dashboard/ScanPanel';
import { ResultsPanel } from './dashboard/ResultsPanel';
import { HistoryView } from './dashboard/HistoryView';
import { ScanningLoader } from './dashboard/ScanningLoader';
import { QuickStats } from './dashboard/QuickStats';
import { mockApi, ScanResult } from '@/utils/mockApi';
import { useScanHistory } from '@/hooks/useScanHistory';
import { Toaster, toast } from 'sonner';
import { Shield, Activity, AlertTriangle, Clock } from 'lucide-react';

interface DashboardProps {
  userEmail: string
  onLogout: () => void
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState(mockApi.getDashboardMetrics());
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const { history, addScan, removeScan } = useScanHistory();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(mockApi.getDashboardMetrics());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleScanStart = () => {
    setIsScanning(true);
    setCurrentResult(null);
  };

  const handleScanComplete = (result: ScanResult) => {
    setIsScanning(false);
    setCurrentResult(result);
    addScan(result);
    // Update metrics when scan completes
    setMetrics((prev) => ({
      ...prev,
      scansToday: prev.scansToday + 1,
      threatsDetected: prev.threatsDetected + (result.threatScore.overall > 50 ? 1 : 0),
    }));
  };

  const handleThreatClick = (result: ScanResult) => {
    setCurrentResult(result);
    toast.info('Loading threat analysis report...', {
      description: `Analyzing ${result.type === 'url' ? 'URL' : 'file'}: ${result.target}`
    });
    
    // Scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userEmail={userEmail} onLogout={onLogout} />

      {/* Main content */}
      <div className="ml-64">
        <Header />

        <main className="p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
                <p className="text-muted-foreground">
                  Monitor threats and analyze security events in real-time
                </p>
              </div>

              {/* Metrics */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <MetricCard
                  title="Threats Detected"
                  value={metrics.threatsDetected}
                  icon={Shield}
                  trend={{ value: 12, isPositive: false }}
                />
                <MetricCard
                  title="Scans Today"
                  value={metrics.scansToday}
                  icon={Activity}
                  trend={{ value: 8, isPositive: true }}
                />
                <MetricCard
                  title="False Positive Rate"
                  value={`${metrics.falsePositiveRate}%`}
                  icon={AlertTriangle}
                  description="Lower is better"
                />
                <MetricCard
                  title="Avg Response Time"
                  value={metrics.avgResponseTime}
                  icon={Clock}
                  description="Scan completion time"
                />
              </div>

              {/* Main panels */}
              <div className="grid gap-6 lg:grid-cols-3">
                <ScanPanel onScanComplete={handleScanComplete} onScanStart={handleScanStart} />
                <ThreatFeed onThreatClick={handleThreatClick} />
              </div>

              {/* Quick Stats */}
              <QuickStats />

              {/* Results */}
              <div ref={resultsRef} className="grid gap-6">
                {isScanning ? <ScanningLoader /> : <ResultsPanel result={currentResult} />}
              </div>
            </div>
          )}

          {activeTab === 'scan' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Security Scanner</h1>
                <p className="text-muted-foreground">
                  Perform deep analysis on URLs and files
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <ScanPanel onScanComplete={handleScanComplete} onScanStart={handleScanStart} />
                </div>
                <div className="lg:col-span-2">
                  {isScanning ? <ScanningLoader /> : <ResultsPanel result={currentResult} />}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Scan History</h1>
                <p className="text-muted-foreground">
                  View and analyze past security scans
                </p>
              </div>
              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-1">
                  <HistoryView 
                    history={history} 
                    onSelectScan={setCurrentResult}
                    onRemoveScan={removeScan}
                  />
                </div>
                <div className="lg:col-span-2">
                  <ResultsPanel result={currentResult} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Security Alerts</h1>
                <p className="text-muted-foreground">
                  Manage and respond to security notifications
                </p>
              </div>
              <div className="rounded-lg border bg-card p-12 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Alerts Center</h3>
                <p className="text-muted-foreground">
                  Security alerts will be displayed here
                </p>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                  Configure your security preferences and integrations
                </p>
              </div>
              <div className="rounded-lg border bg-card p-12 text-center">
                <Shield className="mx-auto h-12 w-12 text-muted-foreground opacity-20 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Settings Panel</h3>
                <p className="text-muted-foreground">
                  Configuration options will be displayed here
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

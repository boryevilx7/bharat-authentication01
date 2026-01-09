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
import { threatAnalysisApi } from '@/lib/api';
import { ScanResult, DashboardMetrics } from '@/utils/mockApi';
import { useScanHistory } from '@/hooks/useScanHistory';
import { Toaster, toast } from 'sonner';
import { Shield, Activity, AlertTriangle, Clock } from 'lucide-react';
import { AIAnalysisPanel } from './dashboard/AIAnalysisPanel';
import { DynamicAnalytics } from './dashboard/DynamicAnalytics';
import { AIInferenceService, AIInferenceResult } from '../services/aiInferenceService';

interface DashboardProps {
  userEmail: string;
  onLogout: () => void;
}

export function Dashboard({ userEmail, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState<DashboardMetrics>({ 
    threatsDetected: 0, 
    scansToday: 0, 
    falsePositiveRate: 0, 
    avgResponseTime: '0s' 
  });
  const [currentResult, setCurrentResult] = useState<ScanResult | null>(null);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIInferenceResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { history, addScan, removeScan } = useScanHistory();
  const resultsRef = useRef<HTMLDivElement>(null);

  // Load initial metrics
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const initialMetrics = await threatAnalysisApi.getDashboardMetrics();
        setMetrics(initialMetrics);
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Fallback to mock data
        setMetrics({
          threatsDetected: Math.floor(Math.random() * 1000) + 500,
          scansToday: Math.floor(Math.random() * 500) + 100,
          falsePositiveRate: parseFloat((Math.random() * 5).toFixed(2)),
          avgResponseTime: `${(Math.random() * 2 + 0.5).toFixed(1)}s`
        });
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();

    // Update metrics periodically
    const interval = setInterval(async () => {
      try {
        const newMetrics = await threatAnalysisApi.getDashboardMetrics();
        setMetrics(newMetrics);
      } catch (error) {
        console.error('Error updating metrics:', error);
      }
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const handleScanStart = () => {
    setIsScanning(true);
    setCurrentResult(null);
  };

  const handleScanComplete = async (result: ScanResult) => {
    setIsScanning(false);
    setCurrentResult(result);
    addScan(result);
    
    // Perform AI analysis
    setIsAnalyzing(true);
    try {
      const aiService = AIInferenceService.getInstance();
      if (result.type === 'url') {
        const aiResult = await aiService.analyzeUrl(result.target);
        setAiAnalysisResult(aiResult);
      } else {
        // For file results, we'd need to access the actual File object
        // For now, we'll simulate with a file name and size from the result
        const dummyFile = new File([], result.target, { type: 'application/vnd.android.package-archive' });
        const aiResult = await aiService.analyzeFile(dummyFile);
        setAiAnalysisResult(aiResult);
      }
    } catch (error) {
      console.error('Error performing AI analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
    
    // Update metrics when scan completes
    try {
      const newMetrics = await threatAnalysisApi.getDashboardMetrics();
      setMetrics(newMetrics);
    } catch (error) {
      console.error('Error updating metrics after scan:', error);
    }
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
                
                {/* AI Analysis Panel */}
                {aiAnalysisResult && !isScanning && (
                  <AIAnalysisPanel result={aiAnalysisResult} />
                )}
                
                {/* Real-time Threat Status */}
                {currentResult && !isScanning && (
                  <div className="p-4 rounded-lg border bg-card">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">Real-time Threat Analysis</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentResult.threatScore.overall > 70 ? 'bg-red-100 text-red-800' : currentResult.threatScore.overall > 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {currentResult.threatScore.overall > 70 ? 'HIGH RISK' : currentResult.threatScore.overall > 40 ? 'MEDIUM RISK' : 'LOW RISK'}
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-4">
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="text-sm text-muted-foreground">Overall</p>
                        <p className="text-lg font-bold">{currentResult.threatScore.overall.toFixed(0)}%</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="text-sm text-muted-foreground">Phishing</p>
                        <p className="text-lg font-bold">{currentResult.threatScore.phishing.toFixed(0)}%</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="text-sm text-muted-foreground">Malware</p>
                        <p className="text-lg font-bold">{currentResult.threatScore.malware.toFixed(0)}%</p>
                      </div>
                      <div className="text-center p-2 bg-muted rounded">
                        <p className="text-sm text-muted-foreground">Fraud</p>
                        <p className="text-lg font-bold">{currentResult.threatScore.fraudulent.toFixed(0)}%</p>
                      </div>
                    </div>
                  </div>
                )}
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

          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
              <DynamicAnalytics />
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
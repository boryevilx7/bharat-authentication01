import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Search, Upload, FileUp } from 'lucide-react';
import { threatAnalysisApi } from '@/lib/api';
import { ScanResult } from '@/utils/mockApi';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ScanPanelProps {
  onScanComplete: (result: ScanResult) => void;
  onScanStart?: () => void;
}

export function ScanPanel({ onScanComplete, onScanStart }: ScanPanelProps) {
  const [urlValue, setUrlValue] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUrlScan = async () => {
    if (!urlValue.trim()) {
      toast.error('Please enter a URL to scan');
      return;
    }

    setIsScanning(true);
    onScanStart?.();
    toast.info('Starting URL scan...');

    try {
      const result = await threatAnalysisApi.scanUrl(urlValue);
      onScanComplete(result);
      toast.success('Scan completed successfully');
      setUrlValue('');
    } catch (error) {
      toast.error('Scan failed. Please try again.');
      console.error('Error scanning URL:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileScan = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to scan');
      return;
    }

    setIsScanning(true);
    onScanStart?.();
    toast.info('Starting file scan...');

    try {
      const result = await threatAnalysisApi.scanFile(selectedFile);
      onScanComplete(result);
      toast.success('Scan completed successfully');
      setSelectedFile(null);
    } catch (error) {
      toast.error('Scan failed. Please try again.');
      console.error('Error scanning file:', error);
    } finally {
      setIsScanning(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`File selected: ${file.name}`);
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Security Scanner</CardTitle>
        <CardDescription>Scan URLs or upload files for threat analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="url">URL Scan</TabsTrigger>
            <TabsTrigger value="file">File Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="url" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Website URL</Label>
              <div className="flex space-x-2">
                <Input
                  id="url"
                  placeholder="https://example.com"
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlScan()}
                  disabled={isScanning}
                />
                <Button onClick={handleUrlScan} disabled={isScanning}>
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Scan
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="rounded-lg border p-4 space-y-2">
              <h4 className="text-sm font-medium">Quick Tips</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Enter the full URL including https://</li>
                <li>• Scan checks for phishing, malware, and fraud indicators</li>
                <li>• Results typically take 2-4 seconds</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload File or APK</Label>
              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50',
                  isScanning && 'opacity-50 cursor-not-allowed'
                )}
                onDragOver={(e) => {
                  e.preventDefault();
                  if (!isScanning) setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => !isScanning && document.getElementById('file-input')?.click()}
              >
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileSelect}
                  disabled={isScanning}
                  accept=".apk,.exe,.zip,.pdf"
                />
                <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  {selectedFile ? selectedFile.name : 'Drag and drop or click to upload'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  APK, EXE, ZIP, PDF (Max 50MB)
                </p>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/50">
                <div className="flex items-center space-x-2">
                  <FileUp className="h-4 w-4" />
                  <div>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <Button onClick={handleFileScan} disabled={isScanning}>
                  {isScanning ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scanning
                    </>
                  ) : (
                    'Scan File'
                  )}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
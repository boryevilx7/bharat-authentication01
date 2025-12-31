import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScanResult, getThreatColor, getThreatBgColor, getThreatLevel } from '@/utils/mockApi';
import { Eye, FileText, Brain, AlertTriangle } from 'lucide-react';

interface ResultsPanelProps {
  result: ScanResult | null;
}

export function ResultsPanel({ result }: ResultsPanelProps) {
  if (!result) {
    return (
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Analysis Results</CardTitle>
          <CardDescription>Scan results will appear here</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <AlertTriangle className="h-16 w-16 mb-4 opacity-20" />
            <p className="text-lg font-medium">No scan results yet</p>
            <p className="text-sm">Start a scan to see detailed analysis</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { threatScore, computerVision, nlpAnalysis, mlConfidence } = result;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          Scan completed at {result.timestamp.toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Threat Score */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Overall Threat Score</h3>
            <Badge
              className={`${getThreatBgColor(threatScore.overall)} ${getThreatColor(threatScore.overall)}`}
            >
              {getThreatLevel(threatScore.overall)} - {threatScore.overall.toFixed(1)}%
            </Badge>
          </div>
          <Progress value={threatScore.overall} className="h-3" />
          
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Phishing</p>
              <Progress value={threatScore.phishing} className="h-2" />
              <p className="text-xs text-muted-foreground">{threatScore.phishing.toFixed(1)}%</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Malware</p>
              <Progress value={threatScore.malware} className="h-2" />
              <p className="text-xs text-muted-foreground">{threatScore.malware.toFixed(1)}%</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Fraudulent</p>
              <Progress value={threatScore.fraudulent} className="h-2" />
              <p className="text-xs text-muted-foreground">{threatScore.fraudulent.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <Accordion type="single" collapsible className="w-full">
          {/* Computer Vision Analysis */}
          {computerVision && (
            <AccordionItem value="cv">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5" />
                  <span>Computer Vision Analysis</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Brand Similarity</p>
                  <Progress value={computerVision.similarity} className="h-2 mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {computerVision.similarity.toFixed(1)}% similarity to known brands
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Matched Brands</p>
                  <div className="flex flex-wrap gap-2">
                    {computerVision.matchedBrands.map((brand) => (
                      <Badge key={brand} variant="outline">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Suspicious Elements</p>
                  <ul className="space-y-1">
                    {computerVision.suspiciousElements.map((element, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start">
                        <span className="mr-2">•</span>
                        {element}
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* NLP Analysis */}
          {nlpAnalysis && (
            <AccordionItem value="nlp">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>NLP Analysis</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Sentiment Analysis</p>
                  <Badge variant={nlpAnalysis.sentiment === 'negative' ? 'destructive' : 'secondary'}>
                    {nlpAnalysis.sentiment}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Detected Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {nlpAnalysis.keywords.map((keyword) => (
                      <Badge key={keyword} variant="outline">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Red Flags</p>
                  <ul className="space-y-1">
                    {nlpAnalysis.redFlags.map((flag, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-start">
                        <AlertTriangle className="h-4 w-4 mr-2 text-orange-500 flex-shrink-0 mt-0.5" />
                        {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* ML Confidence */}
          {mlConfidence !== undefined && (
            <AccordionItem value="ml">
              <AccordionTrigger>
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5" />
                  <span>Machine Learning Confidence</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">Model Confidence Score</p>
                  <Progress value={mlConfidence} className="h-2 mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {mlConfidence.toFixed(1)}% confidence in threat assessment
                  </p>
                </div>

                <div className="rounded-lg border p-4 bg-muted/50">
                  <p className="text-sm font-medium mb-2">Model Information</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    <li>• Trained on 10M+ known threats</li>
                    <li>• Real-time pattern recognition</li>
                    <li>• Last updated: {new Date().toLocaleDateString()}</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
}

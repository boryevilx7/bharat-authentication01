// src/components/dashboard/AIAnalysisPanel.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, BarChart3, Brain, Zap } from 'lucide-react';
import { AIInferenceResult } from '../../services/aiInferenceService';

interface AIAnalysisPanelProps {
  result: AIInferenceResult;
}

export const AIAnalysisPanel = ({ result }: AIAnalysisPanelProps) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          <CardTitle>AI Threat Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Threat Classification</h3>
            <Badge className={getSeverityColor(result.threatTaxonomy.severity)}>
              {result.threatTaxonomy.severity.toUpperCase()}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">{result.threatTaxonomy.category}</span> {'>'} {result.threatTaxonomy.subCategory}
          </p>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span>Confidence: {result.threatTaxonomy.confidence}%</span>
            <div className="h-1 w-1 rounded-full bg-muted-foreground"></div>
            <span>Target: {result.target}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Risk Score
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Overall Risk</span>
                  <span className="text-sm font-medium">{result.riskScore.overallScore}/100</span>
                </div>
                <Progress value={result.riskScore.overallScore} className="w-full" />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-muted rounded">
                  <p className="text-xs text-muted-foreground">C</p>
                  <p className="text-sm font-medium">{result.riskScore.vector.confidentiality}/10</p>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <p className="text-xs text-muted-foreground">I</p>
                  <p className="text-sm font-medium">{result.riskScore.vector.integrity}/10</p>
                </div>
                <div className="text-center p-2 bg-muted rounded">
                  <p className="text-xs text-muted-foreground">A</p>
                  <p className="text-sm font-medium">{result.riskScore.vector.availability}/10</p>
                </div>
              </div>
              
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">CVSS Score: {result.riskScore.cvssScore}</p>
                <p className="text-xs text-muted-foreground">Attack Vector: {result.riskScore.attackVector}</p>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Threat Indicators
            </h3>
            <ul className="space-y-2">
              {result.threatTaxonomy.indicators.map((indicator, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-sm">{indicator}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Analysis Summary
          </h3>
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Summary</p>
              <p className="text-sm">{result.aiAnalysis.summary}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Technical Details</p>
              <p className="text-sm">{result.aiAnalysis.technicalDetails}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Impact Assessment</p>
              <p className="text-sm">{result.aiAnalysis.impactAssessment}</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Mitigation Recommendations
          </h3>
          <ul className="space-y-2">
            {result.threatTaxonomy.mitigationSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="h-1.5 w-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-sm">{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
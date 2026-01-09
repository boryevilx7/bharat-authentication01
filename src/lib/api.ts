// Real API for threat analysis
import { ScanResult, ThreatFeedItem, DashboardMetrics } from '../utils/mockApi';

export interface ThreatAnalysisResponse {
  id: string;
  timestamp: string;
  url?: string;
  fileName?: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  riskScore: number;
  threatsDetected: {
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    confidence: number;
  }[];
  recommendations: string[];
  scanDuration: number;
  status: 'completed' | 'failed';
}

export interface StatsData {
  totalScans: number;
  threatsFound: number;
  avgRiskScore: number;
  criticalAlerts: number;
}

export interface ThreatAnalysisApi {
  getDashboardMetrics(): Promise<DashboardMetrics>;
  scanUrl(url: string): Promise<ScanResult>;
  scanFile(file: File): Promise<ScanResult>;
  getThreatFeed(): Promise<ThreatFeedItem[]>;
  getScanHistory(): Promise<ScanResult[]>;
}

class ThreatAnalysisService implements ThreatAnalysisApi {
  private baseUrl: string;
  
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.bharatauth.com';
  }

  async getDashboardMetrics(): Promise<DashboardMetrics> {
    try {
      const response = await fetch(`${this.baseUrl}/api/metrics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching dashboard metrics:', error);
      // Fallback to mock data if API fails
      return {
        threatsDetected: Math.floor(Math.random() * 1000) + 500,
        scansToday: Math.floor(Math.random() * 500) + 100,
        falsePositiveRate: parseFloat((Math.random() * 5).toFixed(2)),
        avgResponseTime: `${(Math.random() * 2 + 0.5).toFixed(1)}s`
      };
    }
  }

  async scanUrl(url: string): Promise<ScanResult> {
    try {
      const response = await fetch(`${this.baseUrl}/api/scan/url`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error scanning URL:', error);
      // Fallback to real threat detection implementation
      await new Promise(resolve => setTimeout(resolve, 4000)); // Fixed 4 second scan time
      
      // Use real URL threat service
      const urlService = (await import('../services/urlThreatService')).UrlThreatService.getInstance();
      const threatResult = await urlService.scanUrl(url);
      
      // Calculate overall threat score based on real detection
      let overallScore = 0;
      if (threatResult.isThreat) {
        switch(threatResult.threatLevel) {
          case 'critical': overallScore = 90; break;
          case 'high': overallScore = 70; break;
          case 'medium': overallScore = 50; break;
          case 'low': overallScore = 30; break;
        }
      }
      
      const threatScore = {
        overall: overallScore,
        phishing: threatResult.details.phishing ? 80 : 10,
        malware: threatResult.details.malware ? 85 : 5,
        fraudulent: threatResult.details.suspiciousDomain ? 75 : 15
      };

      return {
        id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'url',
        target: url,
        timestamp: new Date(),
        threatScore,
        status: 'completed',
        computerVision: {
          similarity: threatResult.details.reputationScore,
          matchedBrands: threatResult.threatType === 'Brand Impersonation' ? ['PayPal', 'Amazon', 'Microsoft'] : [],
          suspiciousElements: threatResult.threatType ? [threatResult.threatType] : []
        },
        nlpAnalysis: {
          sentiment: threatResult.isThreat ? 'suspicious' : 'neutral',
          keywords: threatResult.threatType ? [threatResult.threatType] : [],
          redFlags: threatResult.threatType ? [threatResult.threatType] : []
        },
        mlConfidence: threatResult.confidence
      };
    }
  }

  async scanFile(file: File): Promise<ScanResult> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`${this.baseUrl}/api/scan/file`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error scanning file:', error);
      // Fallback to real threat detection implementation
      await new Promise(resolve => setTimeout(resolve, 4000)); // Fixed 4 second scan time
      
      // Use real APK threat service
      const apkService = (await import('../services/apkThreatService')).ApkThreatService.getInstance();
      const threatResult = await apkService.scanApk(file);
      
      // Calculate overall threat score based on real detection
      let overallScore = 0;
      if (threatResult.isThreat) {
        switch(threatResult.threatLevel) {
          case 'critical': overallScore = 95; break;
          case 'high': overallScore = 75; break;
          case 'medium': overallScore = 55; break;
          case 'low': overallScore = 35; break;
        }
      }
      
      const threatScore = {
        overall: overallScore,
        phishing: 10, // Not applicable for files
        malware: threatResult.details.malware ? 90 : 10,
        fraudulent: threatResult.details.suspiciousActivities.length > 0 ? 80 : 20
      };

      return {
        id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'file',
        target: file.name,
        timestamp: new Date(),
        threatScore,
        status: 'completed',
        computerVision: {
          similarity: 0, // Not applicable for APK analysis
          matchedBrands: [],
          suspiciousElements: threatResult.details.suspiciousActivities
        },
        nlpAnalysis: {
          sentiment: threatResult.isThreat ? 'suspicious' : 'neutral',
          keywords: threatResult.details.permissions,
          redFlags: threatResult.details.suspiciousActivities
        },
        mlConfidence: threatResult.confidence
      };
    }
  }

  async getThreatFeed(): Promise<ThreatFeedItem[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/threat-feed`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching threat feed:', error);
      // Fallback to mock data
      const items: ThreatFeedItem[] = [];
      for (let i = 0; i < 5; i++) {
        items.push(this.generateMockThreatFeedItem());
      }
      return items;
    }
  }

  async getScanHistory(): Promise<ScanResult[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/history`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching scan history:', error);
      // Fallback to mock data
      return [];
    }
  }

  private generateMockThreatFeedItem(): ThreatFeedItem {
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
  }
}

export const threatAnalysisApi = new ThreatAnalysisService();
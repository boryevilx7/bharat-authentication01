// Mock API for simulating backend responses

export interface ThreatScore {
  overall: number;
  phishing: number;
  malware: number;
  fraudulent: number;
}

export interface ScanResult {
  id: string;
  type: 'url' | 'file';
  target: string;
  timestamp: Date;
  threatScore: ThreatScore;
  status: 'scanning' | 'completed' | 'failed';
  computerVision?: {
    similarity: number;
    matchedBrands: string[];
    suspiciousElements: string[];
  };
  nlpAnalysis?: {
    sentiment: string;
    keywords: string[];
    redFlags: string[];
  };
  mlConfidence?: number;
}

export interface ThreatFeedItem {
  id: string;
  type: 'detection' | 'scan' | 'alert';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  scanResult?: ScanResult;
}

export interface DashboardMetrics {
  threatsDetected: number;
  scansToday: number;
  falsePositiveRate: number;
  avgResponseTime: string;
}

// Mock data generators
const brands = ['PayPal', 'Amazon', 'Microsoft', 'Google', 'Apple', 'Facebook', 'Netflix'];
const suspiciousElements = ['fake login form', 'typosquatting', 'suspicious redirect', 'data harvesting script', 'hidden iframe'];
const redFlags = ['urgency language', 'spelling errors', 'suspicious links', 'request for credentials', 'too good to be true'];
const keywords = ['urgent', 'verify', 'account', 'password', 'suspended', 'click here', 'limited time'];

export const mockApi = {
  // Get dashboard metrics
  getDashboardMetrics: (): DashboardMetrics => {
    return {
      threatsDetected: Math.floor(Math.random() * 1000) + 500,
      scansToday: Math.floor(Math.random() * 500) + 100,
      falsePositiveRate: parseFloat((Math.random() * 5).toFixed(2)),
      avgResponseTime: `${(Math.random() * 2 + 0.5).toFixed(1)}s`
    };
  },

  // Scan URL
  scanUrl: async (url: string): Promise<ScanResult> => {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

    const threatScore: ThreatScore = {
      overall: Math.random() * 100,
      phishing: Math.random() * 100,
      malware: Math.random() * 100,
      fraudulent: Math.random() * 100
    };

    return {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'url',
      target: url,
      timestamp: new Date(),
      threatScore,
      status: 'completed',
      computerVision: {
        similarity: Math.random() * 100,
        matchedBrands: brands.slice(0, Math.floor(Math.random() * 3) + 1),
        suspiciousElements: suspiciousElements.slice(0, Math.floor(Math.random() * 3) + 1)
      },
      nlpAnalysis: {
        sentiment: Math.random() > 0.5 ? 'negative' : 'neutral',
        keywords: keywords.slice(0, Math.floor(Math.random() * 4) + 2),
        redFlags: redFlags.slice(0, Math.floor(Math.random() * 3) + 1)
      },
      mlConfidence: Math.random() * 100
    };
  },

  // Scan file
  scanFile: async (file: File): Promise<ScanResult> => {
    // Simulate scanning delay
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 3000));

    const threatScore: ThreatScore = {
      overall: Math.random() * 100,
      phishing: Math.random() * 100,
      malware: Math.random() * 100,
      fraudulent: Math.random() * 100
    };

    return {
      id: `scan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'file',
      target: file.name,
      timestamp: new Date(),
      threatScore,
      status: 'completed',
      computerVision: {
        similarity: Math.random() * 100,
        matchedBrands: brands.slice(0, Math.floor(Math.random() * 3) + 1),
        suspiciousElements: suspiciousElements.slice(0, Math.floor(Math.random() * 3) + 1)
      },
      nlpAnalysis: {
        sentiment: Math.random() > 0.5 ? 'negative' : 'suspicious',
        keywords: keywords.slice(0, Math.floor(Math.random() * 4) + 2),
        redFlags: redFlags.slice(0, Math.floor(Math.random() * 3) + 1)
      },
      mlConfidence: Math.random() * 100
    };
  },

  // Generate threat feed item
  generateThreatFeedItem: (): ThreatFeedItem => {
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

    const threatScore: ThreatScore = {
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
          matchedBrands: brands.slice(0, Math.floor(Math.random() * 3) + 1),
          suspiciousElements: suspiciousElements.slice(0, Math.floor(Math.random() * 3) + 1)
        },
        nlpAnalysis: {
          sentiment: Math.random() > 0.5 ? 'negative' : 'suspicious',
          keywords: keywords.slice(0, Math.floor(Math.random() * 4) + 2),
          redFlags: redFlags.slice(0, Math.floor(Math.random() * 3) + 1)
        },
        mlConfidence: Math.random() * 100
      }
    };
  }
};

// Helper function to get threat level color
export const getThreatColor = (score: number): string => {
  if (score < 30) return 'text-green-600';
  if (score < 60) return 'text-yellow-600';
  if (score < 80) return 'text-orange-600';
  return 'text-red-600';
};

export const getThreatBgColor = (score: number): string => {
  if (score < 30) return 'bg-green-100 dark:bg-green-900/20';
  if (score < 60) return 'bg-yellow-100 dark:bg-yellow-900/20';
  if (score < 80) return 'bg-orange-100 dark:bg-orange-900/20';
  return 'bg-red-100 dark:bg-red-900/20';
};

export const getThreatLevel = (score: number): string => {
  if (score < 30) return 'Low';
  if (score < 60) return 'Medium';
  if (score < 80) return 'High';
  return 'Critical';
};

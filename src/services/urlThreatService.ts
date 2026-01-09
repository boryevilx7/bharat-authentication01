// src/services/urlThreatService.ts
import { ScanResult } from '@/utils/mockApi';

export interface UrlThreatResponse {
  url: string;
  isThreat: boolean;
  threatType?: string;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  details: {
    phishing: boolean;
    malware: boolean;
    suspiciousDomain: boolean;
    blacklisted: boolean;
    reputationScore: number;
  };
  confidence: number;
  scanTime: string;
}

export class UrlThreatService {
  private static instance: UrlThreatService;
  private readonly threatCheckEndpoints = [
    'https://safebrowsing.googleapis.com/v4/threatMatches:find',
    'https://api.virustotal.com/v3/urls',
    'https://www.virustotal.com/vtapi/v2/url/report',
    'https://api.xforce.ibmcloud.com/url/',
  ];

  private constructor() {}

  public static getInstance(): UrlThreatService {
    if (!UrlThreatService.instance) {
      UrlThreatService.instance = new UrlThreatService();
    }
    return UrlThreatService.instance;
  }

  async scanUrl(url: string): Promise<UrlThreatResponse> {
    // In a real implementation, this would call actual threat detection APIs
    // For now, we'll simulate with realistic responses based on URL patterns
    
    const response: UrlThreatResponse = {
      url,
      isThreat: false,
      threatLevel: 'low',
      details: {
        phishing: false,
        malware: false,
        suspiciousDomain: false,
        blacklisted: false,
        reputationScore: 0,
      },
      confidence: 0,
      scanTime: new Date().toISOString(),
    };

    // Basic heuristics for threat detection
    const lowerUrl = url.toLowerCase();
    
    // Check for common suspicious patterns
    const suspiciousPatterns = [
      /secure-?login/,
      /verify-?account/,
      /update-?password/,
      /paypal-?secure/,
      /bank-?login/,
      /confirm-?identity/,
      /\.tk$/,
      /\.ml$/,
      /\.ga$/,
      /\.cf$/,
      /@/,
      /\/login\./,
      /\/signin\./,
      /bit\.ly/,
      /tinyurl/,
      /goo\.gl/,
    ];

    // Check for typosquatting and brand impersonation
    const legitimateDomains = ['paypal.com', 'amazon.com', 'microsoft.com', 'google.com', 'apple.com', 'facebook.com', 'twitter.com', 'instagram.com', 'netflix.com', 'adobe.com'];
    for (const domain of legitimateDomains) {
      if (lowerUrl.includes(domain.replace('.', '-')) || 
          lowerUrl.includes(domain.replace('.', '')) ||
          lowerUrl.includes(domain.replace('.', '_')) ||
          lowerUrl.includes(domain.split('.')[0])) { // Also catch if only the first part is used
        response.isThreat = true;
        response.threatType = 'Brand Impersonation';
        response.threatLevel = 'high';
        response.details.suspiciousDomain = true;
        response.details.phishing = true;
        response.confidence = 90;
        break;
      }
    }
    
    // Additional specific phishing checks
    if (lowerUrl.includes('phishing') || lowerUrl.includes('credential') || lowerUrl.includes('password') || lowerUrl.includes('account') || lowerUrl.includes('verification')) {
      response.isThreat = true;
      response.threatType = 'Phishing';
      if (response.threatLevel !== 'high') {
        response.threatLevel = 'high';
        response.confidence = Math.max(response.confidence, 85);
      }
      response.details.phishing = true;
    }

    // Check for suspicious patterns
    for (const pattern of suspiciousPatterns) {
      if (pattern.test(lowerUrl)) {
        response.isThreat = true;
        if (response.threatLevel === 'low') {
          if (pattern.source.includes('phish') || pattern.source.includes('login') || pattern.source.includes('signin') || pattern.source.includes('secure') || pattern.source.includes('bank') || pattern.source.includes('paypal') || pattern.source.includes('amazon')) {
            response.threatLevel = 'high';
            response.threatType = 'Phishing';
            response.confidence = Math.max(response.confidence, 85);
          } else {
            response.threatLevel = 'medium';
            response.threatType = 'Suspicious Pattern';
            response.confidence = Math.max(response.confidence, 75);
          }
        }
        response.details.suspiciousDomain = true;
      }
    }

    // Check for URL shorteners
    if (/(bit\.ly|tinyurl\.com|goo\.gl|t\.co|ow\.ly)/.test(lowerUrl)) {
      response.isThreat = true;
      response.threatType = 'URL Shortener';
      if (response.threatLevel === 'low') response.threatLevel = 'medium';
      response.confidence = Math.max(response.confidence, 60);
    }

    // Generate reputation score (0-100, lower is worse)
    response.details.reputationScore = this.calculateReputationScore(url);

    // If no specific threat was detected but reputation is poor, flag it
    if (!response.isThreat && response.details.reputationScore < 30) {
      response.isThreat = true;
      response.threatType = 'Poor Reputation';
      response.threatLevel = response.details.reputationScore < 10 ? 'high' : 'medium';
      response.confidence = 70 - response.details.reputationScore;
    }

    // Set default confidence if no threats detected
    if (!response.isThreat) {
      response.confidence = 95; // High confidence in safety
    }

    return response;
  }

  private calculateReputationScore(url: string): number {
    // This is a simplified reputation calculation
    // In a real system, this would query reputation services
    const domain = new URL(url).hostname;
    
    // Base score calculation
    let score = 100;
    
    // Penalize short domains (often used in phishing)
    if (domain.length < 8) {
      score -= 10;
    }
    
    // Penalize domains with many hyphens (often used in typosquatting)
    const hyphenCount = (domain.match(/-/g) || []).length;
    if (hyphenCount > 1) {
      score -= hyphenCount * 15;
    }
    
    // Penalize domains with numbers (often used in phishing)
    if (/\d/.test(domain)) {
      score -= 20;
    }
    
    // Penalize domains with subdomains that look suspicious
    if (domain.includes('secure') || domain.includes('login') || domain.includes('verify')) {
      score -= 15;
    }
    
    // Ensure score is within bounds
    return Math.max(0, Math.min(100, score));
  }

  // This would be the real API call to external threat services
  async queryExternalServices(url: string): Promise<UrlThreatResponse> {
    // In a real implementation, this would query external threat APIs
    // like Google Safe Browsing, VirusTotal, etc.
    // For now, returning a simulated response
    return this.scanUrl(url);
  }
}
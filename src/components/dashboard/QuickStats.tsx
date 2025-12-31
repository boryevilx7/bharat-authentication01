import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatItem {
  label: string;
  value: string;
  change: number;
  trend: 'up' | 'down' | 'neutral';
}

export function QuickStats() {
  const stats: StatItem[] = [
    { label: 'URLs Scanned', value: '2,847', change: 12.5, trend: 'up' },
    { label: 'Files Analyzed', value: '1,293', change: 8.2, trend: 'up' },
    { label: 'Threats Blocked', value: '432', change: -5.3, trend: 'down' },
    { label: 'System Uptime', value: '99.9%', change: 0, trend: 'neutral' },
  ];

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Statistics</CardTitle>
        <CardDescription>Last 30 days performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center space-x-1">
                  {getTrendIcon(stat.trend)}
                  {stat.change !== 0 && (
                    <span className={`text-xs font-medium ${getTrendColor(stat.trend)}`}>
                      {Math.abs(stat.change)}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

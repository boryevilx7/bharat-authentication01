import { cn } from '@/lib/utils';
import { LayoutDashboard, Search, History, Bell, Settings, Shield, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  userEmail?: string;
  onLogout?: () => void;
}

const navigation = [
  { name: 'Dashboard', id: 'dashboard', icon: LayoutDashboard },
  { name: 'Scan', id: 'scan', icon: Search },
  { name: 'History', id: 'history', icon: History },
  { name: 'Alerts', id: 'alerts', icon: Bell },
  { name: 'Settings', id: 'settings', icon: Settings },
];

export function Sidebar({ activeTab, onTabChange, userEmail, onLogout }: SidebarProps) {
  return (
    <div className="flex h-screen w-64 flex-col fixed left-0 top-0 border-r bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <Shield className="h-6 w-6 text-primary mr-2" />
        <span className="text-xl font-bold">Bharat Authentication</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'flex w-full items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                activeTab === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t p-4 space-y-3">
        {userEmail && (
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs font-medium mb-1">Logged in as</p>
            <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
          </div>
        )}
        <div className="rounded-lg bg-muted p-3">
          <p className="text-xs font-medium">Security Status</p>
          <div className="mt-2 flex items-center space-x-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
        {onLogout && (
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="w-full gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        )}
      </div>
    </div>
  );
}

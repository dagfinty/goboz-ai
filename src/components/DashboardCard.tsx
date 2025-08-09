import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardCardProps {
  title: string;
  titleAmharic: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  notificationCount?: number;
  onClick?: () => void;
  className?: string;
}

const DashboardCard = ({ 
  title, 
  titleAmharic, 
  description, 
  icon: Icon, 
  iconColor, 
  notificationCount,
  onClick,
  className = ""
}: DashboardCardProps) => {
  return (
    <Card 
      className={`relative p-6 gobez-card gobez-hover-lift cursor-pointer group ${className}`}
      onClick={onClick}
    >
      {/* Notification Badge */}
      {notificationCount && notificationCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-6 w-6 p-0 flex items-center justify-center text-xs rounded-full"
        >
          {notificationCount > 99 ? '99+' : notificationCount}
        </Badge>
      )}

      {/* Icon */}
      <div className={`w-12 h-12 rounded-lg ${iconColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform gobez-smooth`}>
        <Icon className="w-6 h-6 text-white" />
      </div>

      {/* Content */}
      <h3 className="font-semibold text-lg mb-2 text-foreground">
        {title}
      </h3>
      
      <p className="text-sm font-ethiopic text-gobez-green mb-2">
        {titleAmharic}
      </p>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Hover indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gobez-green to-gobez-yellow opacity-0 group-hover:opacity-100 transition-opacity gobez-smooth rounded-b-lg"></div>
    </Card>
  );
};

export default DashboardCard;

import React, { useState } from 'react';
import { TripActivity } from '@/types/activity';
import { useActivityVotes } from '@/hooks/useActivityVotes';
import { 
  Card, 
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Calendar, 
  ThumbsUp, 
  ThumbsDown,
  MoreVertical,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';

interface ActivityCardProps {
  activity: TripActivity;
  isCreator: boolean;
  onStatusChange: (activityId: string, status: 'suggested' | 'confirmed' | 'cancelled') => void;
  onDelete: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  activity,
  isCreator,
  onStatusChange,
  onDelete
}) => {
  const { 
    voteSummary, 
    userVote,
    castVote 
  } = useActivityVotes(activity.id);
  
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Date not set';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-600';
      case 'cancelled': return 'bg-red-100 text-red-600';
      default: return 'bg-yellow-100 text-yellow-600';
    }
  };

  return (
    <Card className={`border-l-4 ${
      activity.status === 'confirmed' ? 'border-l-green-500' : 
      activity.status === 'cancelled' ? 'border-l-red-500' : 'border-l-yellow-500'
    }`}>
      <CardContent className="p-4">
        <div className="flex justify-between">
          <h3 className="font-medium text-lg">{activity.title}</h3>
          
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(activity.status)} variant="outline">
              {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
            </Badge>
            
            {isCreator && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {activity.status !== 'confirmed' && (
                    <DropdownMenuItem 
                      onClick={() => onStatusChange(activity.id, 'confirmed')}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      <span>Confirm Activity</span>
                    </DropdownMenuItem>
                  )}
                  
                  {activity.status !== 'cancelled' && (
                    <DropdownMenuItem 
                      onClick={() => onStatusChange(activity.id, 'cancelled')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      <span>Cancel Activity</span>
                    </DropdownMenuItem>
                  )}
                  
                  {activity.status !== 'suggested' && (
                    <DropdownMenuItem 
                      onClick={() => onStatusChange(activity.id, 'suggested')}
                    >
                      <span>Mark as Suggested</span>
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete Activity
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        {activity.description && (
          <p className="text-gray-600 mt-2">{activity.description}</p>
        )}
        
        <div className="mt-4 space-y-2">
          {activity.location && (
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{activity.location}</span>
            </div>
          )}
          
          {activity.date && (
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formatDate(activity.date)}</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="bg-gray-50 p-4 flex justify-between">
        {/* Voting */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm"
            className={userVote?.vote === true ? 'bg-green-100' : ''}
            onClick={() => castVote(true)}
          >
            <ThumbsUp className={`h-4 w-4 mr-2 ${userVote?.vote === true ? 'text-green-600' : ''}`} />
            <span>{voteSummary.upvotes}</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            className={userVote?.vote === false ? 'bg-red-100' : ''}
            onClick={() => castVote(false)}
          >
            <ThumbsDown className={`h-4 w-4 mr-2 ${userVote?.vote === false ? 'text-red-600' : ''}`} />
            <span>{voteSummary.downvotes}</span>
          </Button>
        </div>
        
        <div className="text-xs text-gray-500">
          {voteSummary.total} votes
        </div>
      </CardFooter>
    </Card>
  );
};

export default ActivityCard;

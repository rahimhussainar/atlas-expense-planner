import React from 'react';
import { Star, Pencil, Trash, Image as ImageIcon, Info as InfoIcon, Building2, Car, Ticket, ThumbsUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useToast } from "@/components/ui/use-toast";

const categoryBadgeStyles = {
  fun: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  food: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  sightseeing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < Math.round(rating)
          ? 'text-black dark:text-white'
          : 'text-[#444] dark:text-[#444]'
      } stroke-1`}
      fill={i < Math.round(rating) ? 'currentColor' : 'none'}
    />
  ));
}

function formatPricePerPerson(activity: any) {
  return activity.price_type === 'per_person'
    ? activity.price
    : activity.total_price / 5;
}

const ActivityCard = ({
  activity,
  expanded,
  onExpand,
  onImageUpload,
  onEdit,
  onDelete,
  onVote,
  voteCount,
  hasVoted,
  isAuthenticated,
}: any) => {
  const { toast } = useToast();

  const handleVote = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to vote on activities.",
        variant: "destructive",
      });
      return;
    }
    onVote(activity.id);
  };

  return (
    <div className="group relative">
      <div className="bg-white dark:bg-[#23272b] rounded-xl border border-gray-100 dark:border-[#23272b] transition-all overflow-hidden shadow-sm transform hover:scale-[1.025] hover:shadow-md">
        {/* Edit/Delete icons */}
        <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button className="p-1 transition-transform transition-opacity duration-150 hover:scale-110 hover:opacity-80 dark:hover:[&>svg]:text-atlas-forest" title="Edit" onClick={onEdit}>
            <Pencil className="h-4 w-4 text-atlas-forest dark:text-white" />
          </button>
          <button className="p-1 transition-transform transition-opacity duration-150 hover:scale-110 hover:opacity-80" title="Delete" onClick={onDelete}>
            <Trash className="h-4 w-4 text-red-500 dark:text-red-400" />
          </button>
        </div>
        <div className="flex p-4 space-x-4">
          {/* Activity Image - Thumbnail */}
          <div className="relative w-24 h-24 flex-shrink-0">
            {activity.image ? (
              <img 
                src={activity.image} 
                alt={activity.title}
                className="w-full h-full object-cover rounded-lg border border-atlas-forest/10 dark:border-atlas-forest/30"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-atlas-slate rounded-lg">
                <ImageIcon className="h-6 w-6 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
          {/* Activity Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1 text-foreground dark:text-white">{activity.title}</h3>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${categoryBadgeStyles[activity.category] || categoryBadgeStyles.default}`}
                  >
                    {activity.category ? activity.category.charAt(0).toUpperCase() + activity.category.slice(1) : 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-white">
                    Proposed by {activity.created_by_name || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
            {/* Price Information - always show both per person and total */}
            <div className="mt-2 flex items-center space-x-2">
              <span className="text-lg font-bold text-black dark:text-white">
                ${activity.price_type === 'per_person' ? (activity.price ?? '—') : (activity.total_price && activity.price ? (activity.total_price / (activity.total_price / activity.price)).toFixed(2) : '—')}
              </span>
              <span className="text-sm text-gray-500 dark:text-white font-medium">per person</span>
              <span className="text-xs text-gray-400 dark:text-white">•</span>
              <span className="text-xs font-medium text-gray-400 dark:text-muted-foreground">
                ${activity.total_price ?? '—'} total
              </span>
            </div>
          </div>
        </div>
        {/* Expandable Content */}
        <Collapsible open={expanded} onOpenChange={onExpand}>
          <CollapsibleTrigger asChild>
            <button 
              className="w-full px-4 py-2 text-sm text-atlas-forest dark:text-atlas-forest hover:text-atlas-forest/80 dark:hover:text-atlas-forest/80 flex items-center justify-center border-t border-gray-50 dark:border-[#23272b] transition-colors duration-200 bg-transparent"
            >
              <ChevronDown 
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ease-in-out ${expanded ? 'transform rotate-180' : ''}`} 
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <div className="px-4 py-4 bg-white dark:bg-[#23272b] rounded-b-xl shadow-sm">
              {/* Description */}
              <div className="mb-3 flex items-start gap-2">
                <InfoIcon className="h-4 w-4 mt-0.5 text-gray-700 dark:text-white font-medium" />
                <p className="text-sm text-gray-700 dark:text-white font-normal">{activity.description}</p>
              </div>
              {/* Divider */}
              <div className="border-t border-dashed border-gray-200 dark:border-muted-foreground my-3" />
              {/* Business Section */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center text-sm text-gray-700 dark:text-white font-medium">
                  <Building2 className="h-3 w-3 mr-2 flex-shrink-0 text-gray-700 dark:text-white font-medium" />
                  <span className="align-middle leading-tight">{activity.business_name || '—'}</span>
                </div>
                <div className="flex flex-col ml-5 mt-1">
                  <span className="text-xs text-gray-500 dark:text-white font-normal">{activity.business_address || '—'}</span>
                  <span className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5">
                      {renderStars(activity.business_rating || 0)}
                    </span>
                  </span>
                  {activity.business_website && (
                    <span className="text-xs text-blue-500 dark:text-blue-300 font-normal mt-1">
                      <a href={activity.business_website} target="_blank" rel="noopener noreferrer">{activity.business_website}</a>
                    </span>
                  )}
                  {activity.driveTime && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-muted-foreground font-medium mt-1">
                      <Car className="h-4 w-4 text-gray-700 dark:text-muted-foreground font-medium" />
                      {activity.driveTime} min drive from hotel
                    </span>
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-4">
                <Button 
                  variant="outline"
                  size="sm"
                  className="flex-1 text-[#4a6c6f] dark:text-white bg-white dark:bg-transparent border border-[#4a6c6f] dark:border-white transition-all duration-200 hover:bg-[#e6f0f1] dark:hover:bg-[#4a6c6f] hover:text-[#4a6c6f] dark:hover:text-white hover:border-[#4a6c6f] dark:hover:border-[#4a6c6f]"
                  asChild
                >
                  <a href={activity.ticketLink} target="_blank" rel="noopener noreferrer">
                    <Ticket className="h-4 w-4 mr-2" />
                    Get Tickets
                  </a>
                </Button>
                <Button 
                  variant="ghost"
                  size="sm"
                  className={`text-[#4a6c6f] dark:text-white bg-white dark:bg-transparent border border-[#4a6c6f] dark:border-white transition-all duration-200 hover:bg-[#e6f0f1] dark:hover:bg-[#4a6c6f] hover:text-[#4a6c6f] dark:hover:text-white hover:border-[#4a6c6f] dark:hover:border-[#4a6c6f] ${hasVoted ? 'bg-[#4a6c6f] text-white dark:bg-[#4a6c6f] dark:text-white' : ''}`}
                  onClick={handleVote}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {voteCount} votes
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default ActivityCard; 
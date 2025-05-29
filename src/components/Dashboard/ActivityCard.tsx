import React, { useState } from 'react';
import { Star, Pencil, Trash, Image as ImageIcon, Info as InfoIcon, Building2, Car, ThumbsUp, ChevronDown, Users } from 'lucide-react';
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
          ? 'text-yellow-500 dark:text-yellow-400'
          : 'text-muted-foreground'
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

// Voter Names Tooltip Component
const VoterNamesPopup = ({ voters, isVisible, onClose, buttonRef }: { voters: string[], isVisible: boolean, onClose: () => void, buttonRef: React.RefObject<HTMLButtonElement> }) => {
  if (!isVisible || voters.length === 0) return null;

  return (
    <>
      {/* Backdrop to close popup */}
      <div 
        className="fixed inset-0 z-40"
        onClick={onClose}
      />
      {/* Tooltip Popup */}
      <div className="absolute z-50 bg-background dark:bg-gray-900 border border-border dark:border-gray-600 text-foreground dark:text-white text-sm rounded-lg shadow-lg px-4 py-3 min-w-[200px] max-w-[300px] -top-2 -translate-y-full left-1/2 -translate-x-1/2">
        <div className="font-medium mb-2 text-foreground dark:text-white">Voted by:</div>
        <div className="space-y-1">
          {voters.map((voter, index) => (
            <div key={index} className="flex items-center space-x-2 text-foreground dark:text-gray-200">
              <div className="w-2 h-2 bg-[#4a6c6f] rounded-full" />
              <span>{voter}</span>
            </div>
          ))}
        </div>
        {/* Arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-background dark:border-t-gray-900"></div>
      </div>
    </>
  );
};

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
  voters = [], // New prop for voter names
}: any) => {
  const { toast } = useToast();
  const [showVoterPopup, setShowVoterPopup] = useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const handleVote = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to vote on activities.",
        variant: "destructive",
      });
      return;
    }

    // Simple click to vote/unvote
    onVote(activity.id);
  };

  const handleShowVoters = () => {
    setShowVoterPopup(true);
  };

  return (
    <div className="group relative">
      <div className="bg-card dark:bg-[#242529] rounded-xl border border-border transition-all overflow-hidden shadow-sm transform hover:scale-[1.025] hover:shadow-md">
        {/* Edit/Delete icons - Clean icons without background */}
        <div className="absolute top-3 right-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button className="p-1 transition-transform transition-opacity duration-150 hover:scale-110 hover:opacity-80" title="Edit" onClick={onEdit}>
            <Pencil className="h-4 w-4 text-foreground dark:text-white" />
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
                className="w-full h-full object-cover rounded-lg border border-border"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted rounded-lg">
                <ImageIcon className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
          </div>
          {/* Activity Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-12"> {/* Add right padding to prevent overlap with icons */}
                <h3 className="font-semibold text-lg mb-1 text-foreground dark:text-white">{activity.title}</h3>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${categoryBadgeStyles[activity.category] || categoryBadgeStyles.default}`}
                  >
                    {activity.category ? activity.category.charAt(0).toUpperCase() + activity.category.slice(1) : 'Unknown'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Proposed by {activity.created_by_name || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
            {/* Redesigned Price Information - Vertical layout for better clarity */}
            <div className="mt-3 space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-foreground dark:text-white">
                  ${activity.price_type === 'per_person' ? (activity.price ?? '—') : (activity.total_price && activity.price ? (activity.total_price / (activity.total_price / activity.price)).toFixed(2) : '—')}
                </span>
                <span className="text-sm text-muted-foreground font-medium">per person</span>
              </div>
              <div className="text-sm text-muted-foreground">
                ${activity.total_price ?? '—'} total
              </div>
            </div>
          </div>
        </div>
        {/* Expandable Content */}
        <Collapsible open={expanded} onOpenChange={onExpand}>
          <CollapsibleTrigger asChild>
            <button 
              className="w-full px-4 py-2 text-sm text-muted-foreground hover:text-foreground flex items-center justify-center border-t border-border transition-colors duration-200 bg-transparent"
            >
              <ChevronDown 
                className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ease-in-out ${expanded ? 'transform rotate-180' : ''}`} 
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <div className="px-4 py-4 bg-card dark:bg-[#242529] rounded-b-xl shadow-sm">
              {/* Description */}
              <div className="mb-3 flex items-start gap-2">
                <InfoIcon className="h-4 w-4 mt-0.5 text-foreground dark:text-white font-medium" />
                <p className="text-sm text-foreground dark:text-white font-normal">{activity.description}</p>
              </div>
              {/* Divider */}
              <div className="border-t border-dashed border-border my-3" />
              {/* Business Section */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center text-sm text-foreground dark:text-white font-medium">
                  <Building2 className="h-3 w-3 mr-2 flex-shrink-0 text-foreground dark:text-white font-medium" />
                  <span className="align-middle leading-tight">{activity.business_name || '—'}</span>
                </div>
                <div className="flex flex-col ml-5 mt-1">
                  <span className="text-xs text-muted-foreground font-normal">{activity.business_address || '—'}</span>
                  <span className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5">
                      {renderStars(activity.business_rating || 0)}
                    </span>
                  </span>
                  {activity.driveTime && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground font-medium mt-1">
                      <Car className="h-4 w-4 text-muted-foreground font-medium" />
                      {activity.driveTime} min drive from hotel
                    </span>
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-4">
                {activity.business_website && (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1 text-foreground dark:text-white bg-transparent border border-border hover:bg-muted hover:text-foreground transition-all duration-200"
                    asChild
                  >
                    <a href={activity.business_website} target="_blank" rel="noopener noreferrer">
                      <InfoIcon className="h-4 w-4 mr-2" />
                      More Info
                    </a>
                  </Button>
                )}
                <div className="flex items-center space-x-1">
                  <Button 
                    variant="ghost"
                    size="sm"
                    className={`text-foreground dark:text-white bg-transparent border border-border hover:bg-muted hover:text-foreground transition-all duration-200 ${hasVoted ? 'bg-[#4a6c6f] text-white border-[#4a6c6f] hover:bg-[#395457]' : ''}`}
                    onClick={handleVote}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {voteCount}
                  </Button>
                  {voteCount > 0 && (
                    <Button 
                      ref={buttonRef}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200 p-2"
                      onClick={handleShowVoters}
                    >
                      <InfoIcon className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        {/* Voter Names Tooltip */}
        <VoterNamesPopup 
          voters={voters}
          isVisible={showVoterPopup}
          onClose={() => setShowVoterPopup(false)}
          buttonRef={buttonRef}
        />
      </div>
    </div>
  );
};

export default ActivityCard; 
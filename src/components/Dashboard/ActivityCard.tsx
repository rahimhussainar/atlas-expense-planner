import React, { useState } from 'react';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  User, 
  ThumbsUp, 
  Building2,
  Image as ImageIcon,
  Car,
  Info as InfoIcon,
  ChevronDown,
  ChevronUp,
  Pencil,
  Trash,
  Star
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { CATEGORY_BADGE_STYLES } from '@/constants/activity';
import { StarRating } from './StarRating';
import { ItemCardActions } from '@/components/shared/ItemCardActions';

function formatPricePerPerson(activity: any) {
  return activity.price_type === 'per_person'
    ? activity.price
    : activity.total_price / 5;
}

// Voter Names Tooltip Component - Simplified version
const VoterNamesPopup = ({ voters, isVisible, onClose, voterProfiles }: { voters: string[], isVisible: boolean, onClose: () => void, voterProfiles?: any[] }) => {
  if (!isVisible || voters.length === 0) return null;

  return (
    <>
      {/* Backdrop to close popup */}
      <div 
        className="fixed inset-0 z-[100]"
        onClick={onClose}
      />
      {/* Tooltip Popup - Positioned relative to the button */}
      <div className="absolute bottom-full right-0 mb-2 z-[101]">
        <div className="bg-white dark:bg-[#1f2023] border border-gray-200 dark:border-white/10 text-gray-900 dark:text-white text-sm rounded-lg shadow-xl px-4 py-3 min-w-[200px] max-w-[300px]">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200 dark:border-white/10">
            <ThumbsUp className="w-4 h-4 text-[#4a6c6f]" />
            <span className="font-semibold text-gray-900 dark:text-white">{voters.length} {voters.length === 1 ? 'Vote' : 'Votes'}</span>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {voters.map((voter, index) => {
              const profile = voterProfiles?.find(p => p.full_name === voter);
              const initials = voter.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
              
              return (
                <div key={index} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={voter}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#4a6c6f] to-[#6a9c7f] flex items-center justify-center text-white text-xs font-medium">
                      {initials}
                    </div>
                  )}
                  <span className="text-sm">{voter}</span>
                </div>
              );
            })}
            </div>
        </div>
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
  voterProfiles = [], // New prop for voter profiles
}: any) => {
  const { toast } = useToast();
  const [showVoterPopup, setShowVoterPopup] = useState(false);

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
      <div className="bg-white dark:bg-[#242529] rounded-xl border border-gray-200 dark:border-white/10 transition-all shadow-sm hover:shadow-lg transform hover:scale-[1.02] hover:-translate-y-0.5">
        {/* Edit/Delete icons */}
        <ItemCardActions onEdit={onEdit} onDelete={onDelete} />
        <div className="flex p-4 space-x-4">
          {/* Activity Image - Thumbnail */}
          <div className="relative w-24 h-24 flex-shrink-0">
            {activity.image ? (
              <img 
                src={activity.image} 
                alt={activity.title}
                className="w-full h-full object-cover rounded-lg border border-gray-200 dark:border-white/10"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-lg">
                <ImageIcon className="h-6 w-6 text-gray-400 dark:text-white/40" />
              </div>
            )}
          </div>
          {/* Activity Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 pr-16 md:pr-12"> {/* Increased padding on mobile to prevent overlap */}
                <h3 className="font-semibold text-lg mb-1 text-gray-900 dark:text-white break-words line-clamp-2">{activity.title}</h3>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${CATEGORY_BADGE_STYLES[activity.category as keyof typeof CATEGORY_BADGE_STYLES] || CATEGORY_BADGE_STYLES.default}`}
                  >
                    {activity.category ? activity.category.charAt(0).toUpperCase() + activity.category.slice(1) : 'Unknown'}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    Proposed by {activity.created_by_name || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
            {/* Redesigned Price Information - Vertical layout for better clarity */}
            <div className="mt-3 space-y-1">
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${activity.price_type === 'per_person' ? (activity.price ?? '—') : (activity.total_price && activity.price ? (activity.total_price / (activity.total_price / activity.price)).toFixed(2) : '—')}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">per person</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-500">
                ${activity.total_price ?? '—'} total
              </div>
            </div>
          </div>
        </div>
        {/* Expandable Content */}
        <Collapsible open={expanded} onOpenChange={onExpand}>
          {!expanded && (
          <CollapsibleTrigger asChild>
            <button 
                className="w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center transition-colors duration-200 bg-transparent"
            >
                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-500 transition-transform duration-200 ease-in-out" />
            </button>
          </CollapsibleTrigger>
          )}
          <CollapsibleContent className="overflow-hidden data-[state=open]:animate-collapsible-down data-[state=closed]:animate-collapsible-up">
            <div className="px-4 py-4 bg-gray-50 dark:bg-[#1f2023] rounded-b-xl">
              {/* Description */}
              <div className="mb-3 flex items-start gap-2">
                <InfoIcon className="h-4 w-4 mt-0.5 text-gray-700 dark:text-gray-300 font-medium" />
                <p className="text-sm text-gray-700 dark:text-gray-300 font-normal">{activity.description}</p>
              </div>
              {/* Divider */}
              <div className="border-t border-dashed border-gray-200 dark:border-white/10 my-3" />
              {/* Business Section */}
              <div className="flex flex-col gap-1 mt-2">
                <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 font-medium">
                  <Building2 className="h-3 w-3 mr-2 flex-shrink-0 text-gray-600 dark:text-gray-400 font-medium" />
                  <span className="align-middle leading-tight">{activity.business_name || '—'}</span>
                </div>
                <div className="flex flex-col ml-5 mt-1">
                  <span className="text-xs text-gray-500 dark:text-gray-500 font-normal">{activity.business_address || '—'}</span>
                  {activity.business_rating && (
                  <span className="flex items-center gap-2 mt-1">
                      <StarRating 
                        rating={activity.business_rating || 0} 
                        size="md"
                        showRating
                        totalRatings={activity.business_total_ratings}
                      />
                    </span>
                  )}
                  {activity.driveTime && (
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500 font-medium mt-1">
                      <Car className="h-4 w-4 text-gray-500 dark:text-gray-500 font-medium" />
                      {activity.driveTime} min drive from hotel
                    </span>
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-4 -mx-4 -mb-4 px-4 pb-4 bg-gray-50 dark:bg-[#1f2023]">
                {activity.business_website && (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="flex-1 text-gray-700 dark:text-white bg-transparent border border-gray-300 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
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
                    className={`text-gray-700 dark:text-white bg-transparent border border-gray-300 dark:border-white/20 transition-all duration-200 ${
                      hasVoted 
                        ? 'bg-[#4a6c6f] text-white border-[#4a6c6f] hover:bg-[#395457] hover:text-white' 
                        : 'hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    onClick={handleVote}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {voteCount}
                  </Button>
                  {voteCount > 0 && (
                    <div className="relative">
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all duration-200 p-2"
                      onClick={handleShowVoters}
                    >
                      <InfoIcon className="h-3 w-3" />
                    </Button>
                      {/* Voter Names Tooltip */}
                      <VoterNamesPopup 
                        voters={voters}
                        isVisible={showVoterPopup}
                        onClose={() => setShowVoterPopup(false)}
                        voterProfiles={voterProfiles}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CollapsibleContent>
          {expanded && (
            <CollapsibleTrigger asChild>
              <button 
                className="w-full px-4 py-2 text-sm text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center transition-colors duration-200 bg-transparent"
              >
                <ChevronUp className="h-4 w-4 text-gray-500 dark:text-gray-500 transition-transform duration-200 ease-in-out" />
              </button>
            </CollapsibleTrigger>
          )}
        </Collapsible>
      </div>
    </div>
  );
};

export default ActivityCard; 
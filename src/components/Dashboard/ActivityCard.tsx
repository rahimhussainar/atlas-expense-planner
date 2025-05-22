import React from 'react';
import { Star, Pencil, Trash, Image as ImageIcon, Info as InfoIcon, Building2, Car, Ticket, ThumbsUp, ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

const categoryBadgeStyles = {
  fun: 'bg-[#23272b] text-white dark:bg-[#23272b] dark:text-white',
  food: 'bg-[#23272b] text-white dark:bg-[#23272b] dark:text-white',
  sightseeing: 'bg-[#23272b] text-white dark:bg-[#23272b] dark:text-white',
  default: 'bg-[#23272b] text-white dark:bg-[#23272b] dark:text-white',
};

function renderStars(rating: number) {
  return Array.from({ length: 5 }).map((_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-white text-white' : 'text-[#444] dark:text-[#444]'} stroke-1`}
      fill={i < Math.round(rating) ? 'currentColor' : 'none'}
    />
  ));
}

function formatPricePerPerson(activity: any) {
  return activity.priceType === 'per_person'
    ? activity.price
    : activity.totalPrice / 5;
}

const ActivityCard = ({
  activity,
  expanded,
  onExpand,
  onImageUpload,
  onEdit,
  onDelete,
}: any) => (
  <div className="group relative">
    <div className="bg-white dark:bg-[#23272b] rounded-xl border border-gray-100 dark:border-[#23272b] hover:border-atlas-forest/40 dark:hover:border-atlas-forest/40 transition-all overflow-hidden shadow-sm">
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
                  {activity.category.charAt(0).toUpperCase() + activity.category.slice(1)}
                </span>
                <span className="text-xs text-gray-500 dark:text-white">
                  Proposed by {activity.proposedBy}
                </span>
              </div>
            </div>
          </div>
          {/* Price Information - always show both per person and total */}
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-lg font-bold text-black dark:text-white">${formatPricePerPerson(activity)}</span>
            <span className="text-sm text-gray-500 dark:text-white font-medium">per person</span>
            <span className="text-xs text-gray-400 dark:text-white">•</span>
            <span className="text-xs font-medium text-gray-400 dark:text-white">${activity.totalPrice} total</span>
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
              className={`h-4 w-4 transition-transform duration-200 ease-in-out ${expanded ? 'transform rotate-180' : ''}`} 
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
            <div className="border-t border-dashed border-gray-200 dark:border-atlas-gold/30 my-3" />
            {/* Business Section */}
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center text-sm text-gray-700 dark:text-white font-medium">
                <Building2 className="h-3 w-3 mr-2 flex-shrink-0 text-gray-700 dark:text-white font-medium" />
                <span className="align-middle leading-tight">{activity.businessName}</span>
              </div>
              <div className="flex flex-col ml-5 mt-1">
                <span className="text-xs text-gray-500 dark:text-white font-normal">{activity.address}</span>
                <span className="flex items-center gap-2 mt-1">
                  <span className="flex items-center gap-0.5">
                    {renderStars(activity.rating)}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-white font-normal">({activity.ratingCount} reviews)</span>
                </span>
                {activity.driveTime && (
                  <span className="flex items-center gap-1 text-xs text-gray-700 dark:text-white font-medium mt-1">
                    <Car className="h-4 w-4 text-gray-700 dark:text-white font-medium" />
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
                className="flex-1 border-atlas-forest text-atlas-forest dark:border-white dark:text-white bg-white dark:bg-[#23272b] hover:bg-atlas-forest/10 dark:hover:bg-white/10 transition-all duration-200" 
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
                className="text-atlas-forest dark:text-atlas-forest hover:text-atlas-forest/80 dark:hover:text-atlas-forest/80 transition-colors duration-200"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {activity.votes} votes
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  </div>
);

export default ActivityCard; 
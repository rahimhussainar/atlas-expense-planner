import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import PlacesAutocomplete, { geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
import { DollarSign, User, X, ImagePlus, MapPin, Star, Globe, Building2, FileText, Coins, Tag } from 'lucide-react';
import TripImageUpload from './TripImageUpload';
import { ACTIVITY_CATEGORIES, type CostType, type BusinessDetails } from '@/constants/activity';
import { StarRating } from './StarRating';

// @ts-ignore
// eslint-disable-next-line
declare global {
  interface Window {
    google: any;
  }
}

// Custom component to render selected value with icon
const CategoryDisplay = ({ value }: { value: string }) => {
  const category = ACTIVITY_CATEGORIES.find(opt => opt.value === value);
  if (!category) return <span>Select category</span>;
  
  return (
    <span className="flex items-center gap-2 truncate">
      <span className="flex-shrink-0">{category.icon}</span>
      <span className="truncate">{category.label}</span>
    </span>
  );
};

interface SuggestActivityFormProps {
  onSubmit: (formData: any) => Promise<void>;
  isLoading: boolean;
  submitButtonText: string;
  confirmedParticipantsCount: number;
  initialValues?: any;
  mode?: 'add' | 'edit';
}

const SuggestActivityForm: React.FC<SuggestActivityFormProps> = ({ onSubmit, isLoading, submitButtonText, confirmedParticipantsCount, initialValues = {}, mode = 'add' }) => {
  initialValues = initialValues || {};
  const [title, setTitle] = useState(initialValues.title || '');
  const [category, setCategory] = useState(initialValues.category || 'fun');
  const [costType, setCostType] = useState<CostType>(initialValues.costType || (initialValues.price_type === 'per_person' ? 'perPerson' : 'total') || 'perPerson');
  const [cost, setCost] = useState(
    initialValues.cost !== undefined ? String(initialValues.cost) :
    initialValues.price_type === 'per_person' && initialValues.price !== undefined ? String(initialValues.price) :
    initialValues.price_type === 'total' && initialValues.total_price !== undefined ? String(initialValues.total_price) :
    ''
  );
  const [description, setDescription] = useState(initialValues.description || '');
  const [place, setPlace] = useState(initialValues.business_address || initialValues.location || '');
  const [placeId, setPlaceId] = useState(initialValues.placeId || null);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(initialValues.business ? initialValues.business : 
    (initialValues.business_name || initialValues.business_address) ? {
      name: initialValues.business_name || '',
      address: initialValues.business_address || '',
      rating: initialValues.business_rating || null,
      website: initialValues.business_website || null,
      lat: initialValues.lat || null,
      lng: initialValues.lng || null,
      totalRatings: initialValues.business_total_ratings || null,
    } : null
  );
  const [submitting, setSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialValues.image || null);
  const [showBusinessCard, setShowBusinessCard] = useState(!!(initialValues.business_name || (initialValues.business && initialValues.business.name)));
  const [isManualAddress, setIsManualAddress] = useState(false);

  const confirmedCount = Math.max(confirmedParticipantsCount, 1);
  const totalCost = costType === 'total' ? Number(cost) : Number(cost) * confirmedCount;
  const perPersonCost = costType === 'perPerson' ? Number(cost) : (Number(cost) / confirmedCount);

  const handleSelect = async (address: string, placeId: string) => {
    setPlace(address);
    setPlaceId(placeId);
    setIsManualAddress(false);
    try {
      if (window.google && window.google.maps && window.google.maps.places) {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails({ placeId, fields: ['name', 'formatted_address', 'rating', 'website', 'geometry', 'user_ratings_total'] }, (details, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && details) {
            setBusinessDetails({
              name: details.name || address,
              address: details.formatted_address,
              rating: details.rating || null,
              website: details.website || null,
              lat: details.geometry?.location?.lat(),
              lng: details.geometry?.location?.lng(),
              totalRatings: details.user_ratings_total || null,
            });
            setShowBusinessCard(true);
          } else {
            setBusinessDetails(null);
            setShowBusinessCard(false);
          }
        });
      } else {
        setBusinessDetails(null);
        setShowBusinessCard(false);
      }
    } catch (err) {
      setBusinessDetails(null);
      setShowBusinessCard(false);
    }
  };

  const handleManualAddress = (value: string) => {
    setPlace(value);
    setIsManualAddress(true);
    setPlaceId(null);
    if (value) {
      setBusinessDetails({
        name: null,
        address: value,
        rating: null,
        website: null,
        lat: null,
        lng: null,
        totalRatings: null,
      });
      setShowBusinessCard(true);
    } else {
      setBusinessDetails(null);
      setShowBusinessCard(false);
    }
  };

  const handleClearBusiness = () => {
    setPlace('');
    setPlaceId(null);
    setBusinessDetails(null);
    setShowBusinessCard(false);
    setIsManualAddress(false);
  };

  const handleImageChange = (file: File | null) => {
    setThumbnail(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveImage = () => {
    setThumbnail(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({
      ...(mode === 'edit' && initialValues.id ? { id: initialValues.id } : {}),
      title,
      category,
      costType,
      cost,
      description,
      business: businessDetails,
      place,
      placeId,
      thumbnail,
    });
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="relative h-full flex flex-col bg-background dark:bg-[#242529] rounded-xl">
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="space-y-6 px-4 pt-4 bg-background dark:bg-[#242529]">
          {/* Title with Image Upload */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-border bg-muted dark:bg-[#2e2f33] flex items-center justify-center cursor-pointer transition hover:border-[#4a6c6f] hover:bg-muted/80 relative group overflow-hidden [&&_.trip-upload-text]:hidden">
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-white/90 dark:bg-black/70 backdrop-blur rounded-full p-1 shadow hover:bg-white dark:hover:bg-black transition z-10">
                    <X className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                  </button>
                </>
              ) : (
                <TripImageUpload
                  label=""
                  previewUrl={previewUrl}
                  onImageChange={handleImageChange}
                  onRemoveImage={handleRemoveImage}
                  minimal
                >
                  <ImagePlus className="w-8 h-8 text-muted-foreground group-hover:text-[#4a6c6f] transition" />
                </TripImageUpload>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <Label htmlFor="title" className="mb-2 text-foreground font-medium">Activity Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Beach Day at Santa Monica"
                required
                className="bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder-muted-foreground focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f] rounded-lg px-3 py-2.5 text-base"
              />
            </div>
          </div>

          {/* Cost and Category Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cost Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-4 h-4 text-[#4a6c6f]" />
                <Label className="text-foreground font-medium">Cost <span className="text-red-500">*</span></Label>
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={costType === 'perPerson' ? '0.00' : '0.00'}
                  value={cost}
                  onChange={e => setCost(e.target.value)}
                  required
                  className="pl-10 pr-20 bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder-muted-foreground focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f] rounded-lg py-2.5 text-base"
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center bg-background dark:bg-[#242529] rounded-md p-0.5 border border-border">
                  <button
                    type="button"
                    aria-label="Per Person"
                    className={`p-1.5 rounded text-xs font-medium transition-all ${
                      costType === 'perPerson' 
                        ? 'bg-[#4a6c6f] text-white' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setCostType('perPerson')}
                  >
                    <User className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    aria-label="Total"
                    className={`p-1.5 rounded text-xs font-medium transition-all ${
                      costType === 'total' 
                        ? 'bg-[#4a6c6f] text-white' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setCostType('total')}
                  >
                    <DollarSign className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {cost && (
                <p className="text-xs text-muted-foreground mt-1">
                  {costType === 'perPerson' 
                    ? `$${cost} × ${confirmedCount} ${confirmedCount === 1 ? 'person' : 'people'} = $${(Number(cost) * confirmedCount).toFixed(2)} total`
                    : `$${(Number(cost) / confirmedCount).toFixed(2)} per person (${confirmedCount} ${confirmedCount === 1 ? 'person' : 'people'})`
                  }
                </p>
              )}
            </div>
            
            {/* Category Field */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="w-4 h-4 text-[#4a6c6f]" />
                <Label htmlFor="activity-category" className="text-foreground font-medium">Category</Label>
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="activity-category" className="w-full bg-muted dark:bg-[#2e2f33] border-border text-foreground text-base rounded-lg py-2.5 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span]:truncate">
                  <SelectValue>
                    <CategoryDisplay value={category} />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="bg-card dark:bg-[#2e2f33] border-border rounded-lg">
                  {ACTIVITY_CATEGORIES.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="text-foreground hover:bg-[#4a6c6f] hover:text-white focus:bg-[#4a6c6f] focus:text-white">
                      <span className="flex items-center gap-2">
                        <span className="flex-shrink-0">{opt.icon}</span>
                        <span>{opt.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-[#4a6c6f]" />
              <Label htmlFor="description" className="text-foreground font-medium">Description</Label>
            </div>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the activity, what to bring, meeting point, etc..."
              rows={4}
              className="bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder-muted-foreground focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f] rounded-lg px-3 py-2.5 resize-y text-base"
            />
          </div>

          {/* Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-[#4a6c6f]" />
              <Label htmlFor="activity-place" className="text-foreground font-medium">Location</Label>
            </div>
            <PlacesAutocomplete
              value={place}
              onChange={(value) => {
                setPlace(value);
                setIsManualAddress(true);
              }}
              onSelect={handleSelect}
              searchOptions={{ types: ['establishment'] }}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading: loadingPlaces }) => (
                <div className="relative">
                  <div className="relative">
                    <Input 
                      {...getInputProps({ 
                        id: 'activity-place', 
                        placeholder: 'Search for a business or enter an address...',
                        className: "bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder-muted-foreground pr-10 rounded-lg py-2.5",
                        onKeyDown: (e) => {
                          if (e.key === 'Enter' && suggestions.length === 0 && place) {
                            e.preventDefault();
                            handleManualAddress(place);
                          }
                        },
                        onBlur: () => {
                          if (suggestions.length === 0 && place && !showBusinessCard) {
                            handleManualAddress(place);
                          }
                        }
                      })} 
                    />
                    {place && (
                      <button
                        type="button"
                        onClick={handleClearBusiness}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-muted-foreground/20 rounded-md transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 bg-card dark:bg-[#2e2f33] border border-border rounded-lg shadow-xl mt-1 z-50 max-h-64 overflow-y-auto">
                      {loadingPlaces && <div className="p-3 text-sm text-muted-foreground">Loading...</div>}
                      {suggestions.map((suggestion, index) => {
                        const mainText = suggestion.structured_formatting?.main_text || suggestion.description || '';
                        const secondaryText = suggestion.structured_formatting?.secondary_text || '';
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion)}
                            key={suggestion.placeId || suggestion.description || index}
                            className={`p-3 cursor-pointer transition-colors ${
                              suggestion.active 
                                ? 'bg-[#4a6c6f] text-white' 
                                : 'hover:bg-muted dark:hover:bg-[#3a3b3f]'
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                                suggestion.active ? 'text-white' : 'text-muted-foreground'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <div className={`font-semibold truncate ${
                                  suggestion.active ? 'text-white' : 'text-foreground'
                                }`}>
                                  {mainText}
                                </div>
                                {secondaryText && (
                                  <div className={`text-xs truncate ${
                                    suggestion.active ? 'text-white/80' : 'text-muted-foreground'
                                  }`}>
                                    {secondaryText}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </PlacesAutocomplete>
            
            {/* Business/Address Info Card */}
            {showBusinessCard && businessDetails && (businessDetails.name || businessDetails.address) && (
              <div className="bg-muted dark:bg-[#2e2f33] rounded-lg p-4 border border-border animate-fade-in-up">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-[#4a6c6f]" />
                  <div className="flex-1 min-w-0">
                    {businessDetails.name && (
                      <h4 className="font-semibold text-foreground truncate">{businessDetails.name}</h4>
                    )}
                    <p className="text-sm text-muted-foreground mt-1">{businessDetails.address}</p>
                    
                    {(businessDetails.rating || businessDetails.website) && (
                      <div className="flex items-center gap-4 mt-2">
                        {businessDetails.rating && (
                          <StarRating 
                            rating={businessDetails.rating} 
                            size="sm"
                            showRating
                            totalRatings={businessDetails.totalRatings}
                          />
                        )}
                        
                        {businessDetails.website && (
                          <a 
                            href={businessDetails.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-[#4a6c6f] hover:underline"
                          >
                            <Globe className="w-3 h-3" />
                            Website
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-xs text-muted-foreground">
              💡 Tip: You can search for businesses or enter any address manually
            </p>
          </div>
        </div>
      </div>
      
      {/* Fixed Footer - Absolutely positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-background dark:bg-[#242529] z-20 border-t border-border px-4 py-4">
        <div className="flex justify-end space-x-3">
          <Button 
            type="submit"
            className="bg-[#4a6c6f] hover:bg-[#395457] text-white font-semibold rounded-lg px-6 py-2.5 transition shadow-sm hover:shadow-md"
            disabled={isLoading || submitting}
          >
            {isLoading || submitting ? 'Submitting...' : submitButtonText}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SuggestActivityForm; 
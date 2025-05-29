import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import PlacesAutocomplete, { geocodeByPlaceId, getLatLng } from 'react-places-autocomplete';
import { DollarSign, User, X, ImagePlus } from 'lucide-react';
import TripImageUpload from './TripImageUpload';

// @ts-ignore
// eslint-disable-next-line
declare global {
  interface Window {
    google: any;
  }
}

const CATEGORY_OPTIONS = [
  { value: 'fun', label: 'Fun' },
  { value: 'food', label: 'Food' },
  { value: 'culture', label: 'Culture' },
  { value: 'nature', label: 'Nature' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'other', label: 'Other' },
];

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
  const [costType, setCostType] = useState<'total' | 'perPerson'>(initialValues.costType || (initialValues.price_type === 'per_person' ? 'perPerson' : 'total') || 'perPerson');
  const [cost, setCost] = useState(
    initialValues.cost !== undefined ? String(initialValues.cost) :
    initialValues.price_type === 'per_person' && initialValues.price !== undefined ? String(initialValues.price) :
    initialValues.price_type === 'total' && initialValues.total_price !== undefined ? String(initialValues.total_price) :
    ''
  );
  const [description, setDescription] = useState(initialValues.description || '');
  const [place, setPlace] = useState(initialValues.business_address || initialValues.location || '');
  const [placeId, setPlaceId] = useState(initialValues.placeId || null);
  const [businessDetails, setBusinessDetails] = useState<any>(initialValues.business ? initialValues.business : {
    name: initialValues.business_name || '',
    address: initialValues.business_address || '',
    rating: initialValues.business_rating || null,
    website: initialValues.business_website || null,
    lat: initialValues.lat || null,
    lng: initialValues.lng || null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialValues.image || null);

  const confirmedCount = Math.max(confirmedParticipantsCount, 1);
  const totalCost = costType === 'total' ? Number(cost) : Number(cost) * confirmedCount;
  const perPersonCost = costType === 'perPerson' ? Number(cost) : (Number(cost) / confirmedCount);

  const handleSelect = async (address: string, placeId: string) => {
    setPlace(address);
    setPlaceId(placeId);
    try {
      if (window.google && window.google.maps && window.google.maps.places) {
        const service = new window.google.maps.places.PlacesService(document.createElement('div'));
        service.getDetails({ placeId, fields: ['name', 'formatted_address', 'rating', 'website', 'geometry'] }, (details, status) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && details) {
            setBusinessDetails({
              name: details.name || address,
              address: details.formatted_address,
              rating: details.rating || null,
              website: details.website || null,
              lat: details.geometry?.location?.lat(),
              lng: details.geometry?.location?.lng(),
            });
          } else {
            setBusinessDetails(null);
          }
        });
      } else {
        setBusinessDetails(null);
      }
    } catch (err) {
      setBusinessDetails(null);
    }
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
    <form onSubmit={handleSubmit} className="relative bg-background dark:bg-[#242529] rounded-xl">
      <div className="overflow-auto pb-24 max-h-[70vh]">
        <div className="space-y-6 px-4 bg-background dark:bg-[#242529]">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-20 h-20 rounded-lg border border-border bg-muted dark:bg-[#2e2f33] flex items-center justify-center cursor-pointer transition hover:border-[#4a6c6f] relative group overflow-hidden [&&_.trip-upload-text]:hidden">
              {previewUrl ? (
                <>
                  <img src={previewUrl} alt="Thumbnail" className="w-full h-full object-cover rounded-lg" />
                  <button type="button" onClick={handleRemoveImage} className="absolute top-1 right-1 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100 transition z-10">
                    <X className="w-4 h-4 text-gray-700" />
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
              <Label htmlFor="title" className="mb-2 text-foreground">Activity Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Beach Day"
                required
                className="bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder-muted-foreground focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f] rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="w-full">
            {/* Cost and Category fields in responsive grid */}
            <div className="grid grid-cols-1 md:grid-cols-[2fr_auto_1fr] gap-4 md:gap-2 items-end">
              {/* Cost field */}
              <div className="space-y-2">
                <Label className="block text-foreground">Cost</Label>
                <div className="flex items-center">
                  <span className="mr-2 text-muted-foreground"><DollarSign className="h-5 w-5" /></span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder={costType === 'perPerson' ? 'Per person cost' : 'Total cost'}
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    required
                    className="flex-1 min-w-0 bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder-muted-foreground focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f] rounded-md px-3 py-2 text-base"
                  />
                  <div className="flex items-center bg-muted dark:bg-[#2e2f33] rounded-full px-1 py-1 w-[70px] h-8 border border-border ml-2">
                    <button
                      type="button"
                      aria-label="Per Person"
                      className={`flex-1 flex items-center justify-center rounded-full transition-colors h-6 w-6 ${costType === 'perPerson' ? 'bg-[#4a6c6f] text-white shadow' : 'text-[#4a6c6f] bg-transparent'}`}
                      onClick={() => setCostType('perPerson')}
                    >
                      <User className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label="Total"
                      className={`flex-1 flex items-center justify-center rounded-full transition-colors h-6 w-6 ${costType === 'total' ? 'bg-[#4a6c6f] text-white shadow' : 'text-[#4a6c6f] bg-transparent'}`}
                      onClick={() => setCostType('total')}
                    >
                      <DollarSign className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Vertical Separator */}
              <div className="hidden md:flex items-stretch justify-center">
                <div className="w-px bg-border h-10" />
              </div>
              
              {/* Category field */}
              <div className="space-y-2">
                <Label htmlFor="activity-category" className="block text-foreground">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="activity-category" className="w-full bg-muted dark:bg-[#2e2f33] border-border text-foreground text-base">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-muted dark:bg-[#2e2f33] border-border">
                    {CATEGORY_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-foreground hover:bg-[#4a6c6f]">{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the activity..."
              rows={4}
              className="bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder-muted-foreground focus:border-[#4a6c6f] focus:ring-1 focus:ring-[#4a6c6f] rounded-md px-3 py-2 resize-y"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity-place" className="text-foreground">Business/Place Name</Label>
            <PlacesAutocomplete
              value={place}
              onChange={setPlace}
              onSelect={handleSelect}
              searchOptions={{ types: ['establishment'] }}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading: loadingPlaces }) => (
                <div className="relative">
                  <Input {...getInputProps({ id: 'activity-place', placeholder: 'Type a business or place...' })} className="bg-muted dark:bg-[#2e2f33] border-border text-foreground placeholder-muted-foreground" />
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 bg-muted dark:bg-[#2e2f33] border border-border rounded-lg shadow-lg mt-1 z-50 max-h-56 overflow-y-auto">
                      {loadingPlaces && <div className="p-2 text-sm text-muted-foreground">Loading...</div>}
                      {suggestions.map((suggestion, index) => {
                        const mainText = suggestion.structured_formatting?.main_text || suggestion.description || '';
                        const secondaryText = suggestion.structured_formatting?.secondary_text || '';
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion)}
                            key={suggestion.placeId || suggestion.description || index}
                            className={`p-2 cursor-pointer text-sm transition-colors hover:bg-[#4a6c6f] ${suggestion.active ? 'bg-[#4a6c6f]' : ''}`}
                          >
                            <div className="font-medium text-foreground truncate">{mainText}</div>
                            {secondaryText && <div className="text-xs text-muted-foreground truncate">{secondaryText}</div>}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </PlacesAutocomplete>
          </div>
        </div>
      </div>
      <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-background dark:bg-[#242529] z-20 shadow-[0_-2px_8px_-2px_rgba(0,0,0,0.05)] px-4">
        <Button 
          type="submit"
          className="bg-[#4a6c6f] hover:bg-[#395457] text-white font-semibold rounded-md px-6 py-2 transition"
          disabled={isLoading || submitting}
        >
          {isLoading || submitting ? 'Submitting...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default SuggestActivityForm; 
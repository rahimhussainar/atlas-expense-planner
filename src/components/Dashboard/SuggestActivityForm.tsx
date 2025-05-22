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
    <form onSubmit={handleSubmit} className="relative bg-white dark:bg-[#23272b] rounded-xl">
      <div className="overflow-auto pb-24 max-h-[70vh]">
        <div className="space-y-6 px-4 bg-white dark:bg-[#23272b]">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-20 h-20 rounded-lg border border-border bg-muted flex items-center justify-center cursor-pointer transition hover:border-[#4a6c6f] relative group overflow-hidden [&&_.trip-upload-text]:hidden">
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
                  <ImagePlus className="w-8 h-8 text-gray-400 group-hover:text-[#4a6c6f] transition" />
                </TripImageUpload>
              )}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <Label htmlFor="title" className="mb-2">Activity Title <span className="text-red-500">*</span></Label>
              <Input 
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Beach Day"
                required
                className="bg-card border-border focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest rounded-md px-3 py-2"
              />
            </div>
          </div>
          <div className="w-full">
            {/* Top row: Cost label (left), Category label (right) */}
            <div className="flex w-full items-start mb-2">
              <div className="flex-[3_1_0%] min-w-0 flex items-start">
                <Label className="m-0">Cost</Label>
              </div>
              <div className="flex-[2_1_0%] min-w-0 flex items-start pl-4">
                <Label htmlFor="activity-category" className="m-0">Category</Label>
              </div>
            </div>
            {/* Second row: cost input + toggle (right), separator, category input (right section), perfectly aligned */}
            <div className="flex w-full items-center gap-2 flex-wrap">
              {/* Cost input and toggle */}
              <div className="flex items-center flex-shrink min-w-[220px] max-w-[340px] w-full md:w-auto">
                <span className="mr-2 text-muted-foreground"><DollarSign className="h-5 w-5" /></span>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder={costType === 'perPerson' ? 'Per person cost' : 'Total cost'}
                  value={cost}
                  onChange={e => setCost(e.target.value)}
                  required
                  className="flex-1 min-w-0 bg-card border-border focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest rounded-md px-3 py-2 text-base"
                />
                <div className="flex items-center bg-muted rounded-full px-1 py-1 w-[70px] h-8 border border-border ml-2">
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
              {/* Vertical Separator */}
              <div className="hidden md:flex items-stretch mx-2">
                <div className="w-px bg-border h-10 self-center" />
              </div>
              {/* Category input */}
              <div className="flex flex-col flex-shrink min-w-[180px] max-w-[320px] w-full md:w-auto">
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full min-w-0 bg-white text-base">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about the activity..."
              rows={4}
              className="bg-card border-border focus:border-atlas-forest focus:ring-1 focus:ring-atlas-forest rounded-md px-3 py-2 resize-y"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity-place">Business/Place Name</Label>
            <PlacesAutocomplete
              value={place}
              onChange={setPlace}
              onSelect={handleSelect}
              searchOptions={{ types: ['establishment'] }}
            >
              {({ getInputProps, suggestions, getSuggestionItemProps, loading: loadingPlaces }) => (
                <div className="relative">
                  <Input {...getInputProps({ id: 'activity-place', placeholder: 'Type a business or place...' })} />
                  {suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 bg-white dark:bg-[#23272b] border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg mt-1 z-50 max-h-56 overflow-y-auto">
                      {loadingPlaces && <div className="p-2 text-sm text-gray-500">Loading...</div>}
                      {suggestions.map((suggestion, index) => {
                        const mainText = suggestion.structured_formatting?.main_text || suggestion.description || '';
                        const secondaryText = suggestion.structured_formatting?.secondary_text || '';
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion)}
                            key={suggestion.placeId || suggestion.description || index}
                            className={`p-2 cursor-pointer text-sm transition-colors ${suggestion.active ? 'bg-[#e6f0f1] dark:bg-[#2a323c]' : ''}`}
                          >
                            <div className="font-medium text-card-foreground truncate">{mainText}</div>
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
      <div className="flex justify-end space-x-3 pt-4 sticky bottom-0 bg-white dark:bg-[#23272b] z-20 shadow-[0_-2px_8px_-2px_rgba(0,0,0,0.05)] px-4">
        <Button 
          type="submit" 
          className="bg-[#4a6c6f] hover:bg-[#395457]"
          disabled={isLoading || submitting}
        >
          {isLoading || submitting ? 'Submitting...' : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default SuggestActivityForm; 
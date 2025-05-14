
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ProfileFormProps {
  fullName: string;
  email: string | undefined;
  userId: string;
  onProfileUpdate: (fullName: string) => void;
}

const ProfileForm = ({ fullName, email, userId, onProfileUpdate }: ProfileFormProps) => {
  const { toast } = useToast();
  const [name, setName] = useState(fullName);
  const [loading, setLoading] = useState(false);

  const updateProfile = async () => {
    try {
      setLoading(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId);

      if (error) throw error;

      onProfileUpdate(name);

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: error.message || 'Could not update your profile.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-4">
      <div>
        <Label htmlFor="fullName" className="text-sm font-medium">
          Full Name
        </Label>
        <Input
          id="fullName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>
      
      <div>
        <Label htmlFor="email" className="text-sm font-medium">
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={email || ''}
          disabled
          className="mt-1 bg-gray-50 text-gray-500"
        />
        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
      </div>

      <div className="pt-4 flex justify-end">
        <Button
          onClick={updateProfile}
          disabled={loading}
          className="bg-atlas-forest hover:bg-atlas-forest/90"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileForm;

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, avatar_url')
        .eq('id', user.id)
        .single();
      if (error) {
        toast({ title: 'Error', description: error.message, variant: 'destructive' });
        return;
      }
      setFullName(data.full_name || '');
      setAvatarUrl(data.avatar_url || '');
    };
    fetchProfile();
  }, [user, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    let uploadedUrl = avatarUrl;
    try {
      if (file) {
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(`${user.id}/${file.name}`, file, { upsert: true });
        if (error) throw error;
        const { data: publicUrlData } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${user.id}/${file.name}`);
        uploadedUrl = publicUrlData.publicUrl;
      }
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ full_name: fullName, avatar_url: uploadedUrl })
        .eq('id', user.id);
      if (updateError) throw updateError;
      toast({ title: 'Profile Updated', description: 'Your profile has been updated.' });
      setAvatarUrl(uploadedUrl);
      setFile(null);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSave} className="bg-white rounded-lg shadow p-8 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold mb-4 text-center">My Profile</h1>
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="h-20 w-20">
            <AvatarImage src={file ? URL.createObjectURL(file) : avatarUrl} alt={fullName} />
            <AvatarFallback>{fullName ? fullName[0] : '?'}</AvatarFallback>
          </Avatar>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mt-2" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            required
          />
        </div>
        <Button type="submit" className="w-full bg-atlas-forest hover:bg-atlas-forest/90" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
};

export default Profile; 
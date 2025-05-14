
import React from 'react';
import DashboardHeader from '@/components/Dashboard/DashboardHeader';
import ProfileContainer from '@/components/Profile/ProfileContainer';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container mx-auto px-4 py-8">
        <ProfileContainer />
      </div>
    </div>
  );
};

export default Profile;

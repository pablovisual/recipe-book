'use client';
import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { UserAuth } from "../context/AuthContext";
import AddRecipe from '../components/AddRecipe';
import MobileAddRecipeModal from '../components/MobileAddRecipeModal';
import RecipeList from '../components/RecipeList';

const Page = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRecipeAdded = () => {
    // Increment the trigger to cause RecipeList to re-fetch
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      setLoading(false);
    }
    checkAuthentication();
  }, [user]);

  return (
    <div className='flex flex-row p-4 h-[87vh]'>
      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          {/* Desktop/tablet: show sidebar AddRecipe */}

          <AddRecipe
              userId={user.uid}
              onRecipeAdded={handleRecipeAdded}
            />


          {/* Mobile: use a modal/popup component that contains AddRecipe */}
          <MobileAddRecipeModal userId={user.uid} onRecipeAdded={handleRecipeAdded} />

          {/* Recipe list fills remaining space */}

            <RecipeList
              userId={user.uid}
              refreshTrigger={refreshTrigger}
            />

        </>
      ) : (
        <div className="flex items-center justify-center w-full h-screen">
          <p className="text-xl text-black">
            You are not logged in. Click{' '}
            <Link href="/login" className="text-blue-500 hover:underline hover:cursor-pointer">
              here
            </Link>{' '}
            to login or create an{' '}
            <Link href="/register" className="text-blue-500 hover:underline hover:cursor-pointer">
              account
            </Link>.
          </p>
        </div>
      )}
    </div>
  );
};

export default Page;
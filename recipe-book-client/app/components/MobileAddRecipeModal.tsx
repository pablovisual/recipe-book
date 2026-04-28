'use client';
import React, { useState } from 'react';
import AddRecipe from './AddRecipe';
import { Button } from '@/components/ui/button';
import { IoMdAdd } from 'react-icons/io';
import { RxCross1 } from "react-icons/rx";

interface Props {
  userId: string;
  onRecipeAdded: () => void;
}

const MobileAddRecipeModal: React.FC<Props> = ({ userId, onRecipeAdded }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Floating action button */}
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full w-14 h-14 flex items-center justify-center text-white bg-blue-600 shadow-lg"
          title="Add recipe"
        >
          <IoMdAdd size={22} />
        </Button>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" onClick={() => setOpen(false)} />

          <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-lg z-50 overflow-auto max-h-[90vh]">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-lg font-medium">Add Recipe</h3>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                <RxCross1 />
              </Button>
            </div>

              <div className="p-4">
                <AddRecipe
                  userId={userId}
                  onRecipeAdded={onRecipeAdded}
                  onClose={() => setOpen(false)}
                  isModal={true}
                />
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAddRecipeModal;



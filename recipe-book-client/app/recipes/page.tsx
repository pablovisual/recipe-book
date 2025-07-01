import React from 'react';
import AddRecipe from '../components/AddRecipe';
import recipes from "@/recipe";
import Image from "next/image";

interface Props {
  // Define your props here
}

const Page = () => {
  return (
    <div className='flex flex-row p-4 h-full'>
      <div className="w-[30%] mt-44 max-h-screen overflow-y-scroll scrollbar-none">
        <AddRecipe />
      </div>

      <div className="w-[70%] grid grid-cols-3 gap-4 content-evenly md:pb-28 max-h-screen overflow-auto scrollbar-none flex-grow">
        {recipes.map((recipe) => (
          <div key={recipe.id}
               className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-300">
            <a className='' href="#">
              <Image width={500} height={500} src={recipe.picture} alt={"pizza"} className='rounded-t-lg'/>
            </a>

            <div className="p-5">
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{recipe.title}</h5>
              <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{recipe.description}</p>
              <a href="#"
                 className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Read more
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
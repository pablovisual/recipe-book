'use client';
import Image from "next/image";
//import pizza from '../public/healthy-pizza.jpg';
import recipes from '../recipe';
//import {useEffect, useState} from "react";

export default function Home() {
  return (
    <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 max-w-7xl mx-auto">
      {recipes.map((recipe) => (
        <article key={recipe.id} className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-300 overflow-hidden">
          <a href="#" className="block">
            <Image
              src={recipe.picture}
              alt={recipe.title}
              width={500}
              height={500}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-48 sm:h-56 md:h-64 object-cover"
            />
          </a>

          <div className="p-4 sm:p-5">
            <h5 className="mb-2 text-lg sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{recipe.title}</h5>
            <p className="mb-3 text-sm sm:text-base text-gray-700 dark:text-gray-400 line-clamp-3">{recipe.description}</p>
            <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              Read more
            </a>
          </div>
        </article>
      ))}
    </main>
  );
}

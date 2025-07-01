'use client';

import React from 'react';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RecipeData {
  name: string,
  time: string,
  ingredients: string,
  description: string,
}

const recipeSchema = z.object({
  name: z.string().min(6, { message: 'Must have a name for your dish.'}),
  time: z.string().min(1, { message: 'Must give a set cook time.'}).max(999, { message: 'Can\'t be that long of cooking time.'}).refine(val => !isNaN(parseInt(val)), { message: 'That\'s not a number.'}),
  ingredients: z.string().min(10, { message: 'Must type out ingredients.'}),
  description: z.string().min(10, { message: 'Must give a description.' }),
});

const AddRecipe = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RecipeData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      name: '',
      time: '',
      ingredients: '',
      description: ''
    },
    mode: "onChange"
  });
  const createRecipe = (data: RecipeData) => {
    const { name, time, ingredients, description } = data;

    if(Math.floor(parseInt(time) / 60) == 0) {
      const min:string = (parseInt(time) % 60).toString();
      console.log(`Title: ${ name } \nCooking time: ${ min } minutes\n Ingredients:\n${ ingredients } \nDescription: ${ description }`);
    }

    else {
      const cookingTime:String = `${ (Math.floor(parseInt(time) / 60)).toString() } hours ${ (parseInt(time) % 60).toString() } minutes`;
      console.log(`Title: ${ name } \nCooking time: ${ cookingTime } \nIngredients:\n${ ingredients } \nDescription: ${ description }`);
    }

  }
  return (
    <form onSubmit={handleSubmit(createRecipe)} className='p-4 space-y-5'>
      <div className="space-y-2 ">
        <Input className='w-full outline-none' placeholder="Recipe name" {...register('name')} />
        {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
      </div>
      <div>
        <Input className='outline-none' type='number' min={1} max={999} placeholder="Cooking Time" {...register('time')} />
        {errors.time && <p className='text-red-500 text-sm mt-1'>{errors.time.message}</p>}
      </div>
      <div>
        <Textarea placeholder="Make an ingredients list by new lines or commas." {...register('ingredients')} />
        {errors.ingredients && <p className='text-red-500 text-sm mt-1'>{errors.ingredients.message}</p>}
      </div>
      <div>
        <Textarea placeholder="Type the description on preparing the recipe." {...register('description')} />
        {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>}
      </div>

      <Button type="submit" variant='outline' className="rounded-full bg-blue-700 text-white text-xl p-4 w-1/4 uppercase primary float-right">
        Add
      </Button>
    </form>
  );
};

export default AddRecipe;
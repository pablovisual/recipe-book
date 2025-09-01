'use client';

import React, { useState} from 'react';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input";

interface RecipeData {
  title: string,
  time: string,
  ingredients: string,
  description: string,
}

const recipeSchema = z.object({
  title: z.string().min(6, { message: 'Must have a name for your dish.'}),
  time: z.string().min(1, { message: 'Must give a set cook time.'}).max(999, { message: 'Can\'t be that long of cooking time.'}).refine(val => !isNaN(parseInt(val)), { message: 'That\'s not a number.'}),
  ingredients: z.string().min(10, { message: 'Must type out ingredients.'}),
  description: z.string().min(10, { message: 'Must give a description.' }),
});

const AddRecipe = () => {
  const [image, setImage] = useState("");
  const [error, setError] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<RecipeData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      time: '',
      ingredients: '',
      description: '',
    },
    mode: "onChange"
  });

  const getImage = (e:any) => {
    //grab the image file
    const img = e.target.files[0];

    //check if file is an image
    if(!img.name.match(/\.(bpm|jpg|jpeg|png|svg|tif|tiff|webp)$/)) {
      setError("Wrong file Type!");
      return;
    }

    //image can't be greater than 5mb
    if(img.size > (1024 * 1024 * 5)) {
      setError(`File size is ${img.size} which is > than 5MB`);
      return;
    }

    //make image to base64 string
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      //console.log(reader.result);
      //set the image with reader.result->string
      setImage(reader?.result);
    };

    setError("");

    reader.onerror = error => {
      console.log(`Error: ${error}`);
    }
  }
  const createRecipe = (data:  RecipeData) => {
    const { title, time, ingredients, description } = data;

    //if error useState is not empty then return nothing
    if(error.length > 0)
      return;

    //if user doesn't add image, set error and return nothing
    if(image.length == 0) {
      setError('Image file cant be empty');
      return;
    }

    if(Math.floor(parseInt(time) / 60) == 0) {
      const min:string = (parseInt(time) % 60).toString();
      console.log(`Title: ${ title } \nCooking time: ${ min } minutes\n Ingredients:\n${ ingredients } \nDescription: ${ description }\n Image: ${ image }`);
    }

    else {
      const cookingTime:String = `${ (Math.floor(parseInt(time) / 60)).toString() } hours ${ (parseInt(time) % 60).toString() } minutes`;
      console.log(`Title: ${ title } \nCooking time: ${ cookingTime } \nIngredients:\n${ ingredients } \nDescription: ${ description }\n Image: ${ image }`);
    }
  }

  return (
    <form onSubmit={handleSubmit(createRecipe)} className='p-4 space-y-5 h-[80vh] flex flex-col justify-center'>
      <div className="space-y-2 ">
        <Input className='w-full outline-none' placeholder="Recipe name" {...register('title')} />
        {errors.title && <p className='text-red-500 text-sm mt-1'>{errors.title.message}</p>}
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
      <div>
        <Input id="picture" accept='image/*' onChange={getImage} type="file" />
        {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
      </div>

      <Button type="submit" variant='outline' className="rounded-full bg-blue-700 text-white text-xl p-4 w-1/4 uppercase primary float-right">
        Add
      </Button>
    </form>
  );
};

export default AddRecipe;
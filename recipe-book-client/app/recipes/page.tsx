'use client';
import React, {useContext, useEffect, useState} from 'react';
import AddRecipe from '../components/AddRecipe';
import recipes from "@/recipe";
import Image from "next/image";
import Link from "next/link";
import {UserAuth} from "../context/AuthContext";
import {ok} from "node:assert";
import Recipe from "@/recipe";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod/v4";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";

interface RecipeData {
  title: string,
  time: string,
  ingredients: string,
  instructions: string,
  description: string,
}

const recipeSchema = z.object({
  title: z.string().min(6, {message: 'Must have a name for your dish.'}),
  time: z.string().min(1, {message: 'Must give a set cook time.'}).max(999, {message: 'Can\'t be that long of cooking time.'}).refine(val => !isNaN(parseInt(val)), {message: 'That\'s not a number.'}),
  ingredients: z.string().min(10, {message: 'Must type out ingredients.'}),
  instructions: z.string().min(10, {message: 'Must type out instructions.'}),
  description: z.string().min(10, {message: 'Must give a description.'}),
});

const Page = () => {
  const {user} = UserAuth();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [data, setData] = useState(null);

  const {register, handleSubmit, formState: {errors}} = useForm<RecipeData>({
    resolver: zodResolver(recipeSchema),
    defaultValues: {
      title: '',
      time: '',
      ingredients: '',
      instructions: '',
      description: '',
    },
    mode: "onChange"
  });

  const getImage = (e: any) => {
    //grab the image file
    const img = e.target.files[0];

    //check if file is an image
    if (!img.name.match(/\.(bpm|jpg|jpeg|png|svg|tif|tiff|webp)$/)) {
      setError("Wrong file Type!");
      return;
    }

    //image can't be greater than 5mb
    if (img.size > (1024 * 1024 * 5)) {
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
  const createRecipe = async (data: RecipeData) => {
    const {title, time, ingredients, instructions, description} = data;

    //if error useState is not empty then return nothing
    if (error.length > 0)
      return;

    //if user doesn't add image, set error and return nothing
    if (image.length == 0) {
      setError('Image file cant be empty');
      return;
    }

    const ingredientList: string[] = ingredients.replace(/\n/g, ',').split(',').map(value => {
      return value.trim();
    });


    if (Math.floor(parseInt(time) / 60) == 0) {
      const cookingTime: string = (parseInt(time) % 60).toString();
      try {
        const response = await fetch('http://localhost:8080/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            recipeTitle: title,
            ingredients: ingredientList,
            description: description,
            cookTime: cookingTime,
            cookInstructions: instructions,
            recipeImage: image,
            user_id: user.uid
          }),
        }).catch(error => {
          console.log(error);
          return;
        });

        getUsersRecipes();
      } catch (error) {
        console.log(error);
      }
    } else {
      const cookingTime: String = `${(Math.floor(parseInt(time) / 60)).toString()} hours ${(parseInt(time) % 60).toString()} minutes`;
      try {
        const response = await fetch('http://localhost:8080/recipes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            recipeTitle: title,
            ingredients: ingredientList,
            description: description,
            cookTime: cookingTime,
            cookInstructions: instructions,
            recipeImage: image,
            user_id: user.uid
          }),
        }).catch(error => {
          console.log(error);
          return;
        });

        getUsersRecipes();
      } catch (error) {
        console.log(error);
      }
    }
  }

  const getUsersRecipes = async () => {
    const getRecipes = await fetch(`http://localhost:8080/recipes/${user?.uid}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }

      return response.json();
    }).then((user_data) => {
      return user_data;

    }).catch((err) => {
      console.log(err);
    });

    setData(getRecipes);
  }

  //console.log(data);


  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise(resolve => setTimeout(resolve, 50));
      setLoading(false);
    }
    checkAuthentication();
    getUsersRecipes();
  }, [user]);

  return (
    <div className='flex flex-row p-4 h-[87vh]'>
      {loading ? <p>Loading...</p> : user ? (
        <>
          <div className="w-[30%]  h-full overflow-y-scroll scrollbar-none">
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
                <Textarea placeholder="Jot down the instructions." {...register('instructions')} />
                {errors.instructions && <p className='text-red-500 text-sm mt-1'>{errors.instructions.message}</p>}
              </div>
              <div>
                <Textarea placeholder="Type the description on preparing the recipe." {...register('description')} />
                {errors.description && <p className='text-red-500 text-sm mt-1'>{errors.description.message}</p>}
              </div>
              <div>
                <Input id="picture" accept='image/*' onChange={getImage} type="file"/>
                {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
              </div>

              <Button type="submit" variant='outline' className="rounded-full bg-blue-700 text-white text-xl p-4 w-1/4 uppercase primary float-right">
                Add
              </Button>
            </form>
          </div>
          <div
            className="w-[70%] grid grid-cols-3 gap-4 content-evenly max-h-screen overflow-auto scrollbar-none flex-grow">
            {data?.map((recipe: any) => (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-300">
                <a className='' href="#">
                  <Image width={300} height={300} src={recipe.recipeImage} alt={"pizza"} className='rounded-t-lg'/>
                </a>

                <div className="p-5">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{recipe.recipeTitle}</h5>
                  <p className='text-lg tracking-tight text-gray-900 dark:text-white'>{recipe.cookTime}</p>
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{recipe.description}</p>
                  <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Read more
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center w-full h-screen">
          <p className="text-xl text-black">You are not logged in. Click <Link href="/login" className="text-blue-500 hover:underline hover:cursor-pointer">here</Link> to login or create an <Link href="/register" className="text-blue-500 hover:underline hover:cursor-pointer">account</Link>.</p>
        </div>
      )}

    </div>
  );
};

export default Page;
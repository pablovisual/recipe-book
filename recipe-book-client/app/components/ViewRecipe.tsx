'use client';

import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { UserAuth } from "../context/AuthContext";


import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Skeleton} from "@/components/ui/skeleton";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Spinner} from "@/components/ui/spinner";
import Link from "next/link";

interface Recipe {
  _id: string;
  recipeTitle: string;
  recipeImage: string;
  cookTime: string
  ingredients: string[];
  cookInstructions: string;
  user_id: string;
}

interface RecipeProps {
  recipeSlug: string;
}

const ViewRecipe: React.FC<RecipeProps> = ({recipeSlug}) => {
  const { user } = UserAuth();
  const [data, setData] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  // separate auth loading (waiting for auth context) and recipe loading (fetching data)
  const [authLoading, setAuthLoading] = useState(true);
  const [recipeLoading, setRecipeLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [deleteByUID, setDeleteByUID] = useState("");
  const [updateByUID, setUpdateByUID] = useState("");

  const [recipeTitle, setRecipeTitle] = useState("");
  const [image, setImage] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [confirmDeletion, setConfirmDeletion] = useState("");

  const router = useRouter();

  const listIngredientsTag = []; //hold the list of ingredients in <li> tag
  //console.log(recipeSlug);

  const updateImage = ( e:any) => {
    const img = e.target.files[0];

    if (!img.name.match(/\.(bpm|jpg|jpeg|png|svg|tif|tiff|webp)$/)) {
      setError("Wrong file Type!");
      return;
    }

    if (img.size > (1024 * 1024 * 5)) {
      setError(`File size is ${img.size} which is > than 5MB`);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      setImage(reader?.result as string);
    };

    setError("");

    reader.onerror = error => {
      console.log(`Error: ${error}`);
    }
  }

  const getRecipeByRecipeSlug = async () => {
    try {
      setRecipeLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/recipe/${recipeSlug}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        setError(response.statusText || 'Failed to get recipe');
        return;
      }

      const user_data = await response.json();
      setData(user_data);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to get recipe");
    } finally {
      setRecipeLoading(false);
    }
  }

  const editAction = (recipeUID: string, recipeTitle: string, cookTime: string, image: string, ingredients: string, instructions: string) => {
    setUpdateByUID(recipeUID);
    setRecipeTitle(recipeTitle);
    setImage(image);
    setCookTime(cookTime);
    setIngredients(ingredients);
    setInstructions(instructions);
    setConfirmDeletion("");
    return;
  }

  const editRecipe = (recipeUID: string, title: string, time: string, image: string, ingredients: string, instructions: string) => async () => {
    setEdit(true);

    let newIngredientList: string[];

    if(ingredients != data?.ingredients?.toString()) {
      console.log("hi");
      newIngredientList = ingredients.replace(/\n/g, ',').split(',').map(value => {
        return value.trim();
      });
    }

    else {
      newIngredientList = data?.ingredients;
    }

    if(cookTime !== data?.cookTime) {
      time = `${(Math.floor(parseInt(cookTime) / 60)).toString()} hours ${(parseInt(cookTime) % 60).toString()} minutes`;
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/recipe/${recipeUID}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeTitle: title,
          ingredients: newIngredientList,
          cookTime: time,
          cookInstructions: instructions,
          recipeImage: image
        })
      });

      if (!response.ok) {
        setError(response.statusText || 'Failed to update recipe');
        setEdit(false);
        return;
      } else if (response.status === 202) {
        setError("");
        setUpdateByUID("");
        setEdit(false);
        return;
      }

      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to update recipe");
    } finally {
      await getRecipeByRecipeSlug();
      setUpdateByUID("");
      setEdit(false);
    }
  }

  const deletionCheck = (recipeID: string) => {
    setConfirmDeletion(recipeID);
  }

  const deleteRecipe = (recipeUID: string) => async () => {
    setDeleteByUID(recipeUID);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeUID}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        setError(response.statusText || 'Failed to delete recipe');
        return;
      }

      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to delete recipe");
    } finally {
      setUpdateByUID("");
      setConfirmDeletion("");
      router.push('/recipes');
    }
  }

  useEffect(() => {
    // Wait for auth context to settle, then fetch recipe if user is present.
    const checkAuthentication = async () => {
      // small delay to let auth context initialize (same pattern used elsewhere)
      await new Promise(resolve => setTimeout(resolve, 300));
      setAuthLoading(false);

      // If you require a signed-in user to view the recipe, skip fetching when no user
      if (!user) {
        setRecipeLoading(false);
        return;
      }

      await getRecipeByRecipeSlug();
    };

    checkAuthentication();
  }, [user, recipeSlug]);

  for (const [index, value] of data?.ingredients.entries() || "No recipes found") {
    listIngredientsTag.push(<li key={index}>{value}</li>)
  }

  //console.log(data)
  //console.log(error);

  // Show loading skeleton while auth or recipe data is loading to avoid flicker
  if (authLoading || recipeLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className='w-full max-w-[500px] pt-0'>
          <CardContent className='px-0'>
            <div className="w-full aspect-square relative overflow-hidden rounded-t-xl">
              <Skeleton className="w-full h-full" />
            </div>
          </CardContent>
          <CardHeader>
            <Skeleton className="h-4 w-1/2"/>
            <Skeleton className="h-4 w-2/3"/>
          </CardHeader>
          <CardFooter className='gap-3 max-sm:flex-col max-sm:items-stretch'>
            <Skeleton className="h-9 w-14"/>
            <Skeleton className="h-9 w-20"/>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {user ? (
          user.uid === data?.user_id ? (
            <Card className='w-full max-w-[500px]'>
              <CardContent className='pb-0 pt-6'>
                <div className="w-full aspect-square relative overflow-hidden rounded-t-xl">
                  <Image
                    src={data?.recipeImage || "/placeholder.png"}
                    alt={data?.recipeTitle || "Recipe Image"}
                    fill
                    sizes="(max-width: 640px) 100vw, 500px"
                    className="object-cover"
                  />
                </div>
              </CardContent>
              {updateByUID === data?._id ? (
                <>
                  <CardHeader>
                    <Input value={recipeTitle} type="text" placeholder="Recipe Title"
                           onChange={(e) => (setRecipeTitle(e.currentTarget.value))}/>
                    <Input value={cookTime} className='outline-none' type="number" min={1} max={999} placeholder="Time" onChange={(e) => (setCookTime(e.currentTarget.value))}/>
                    <CardTitle>Ingredients: </CardTitle>
                    <Input value={ingredients} placeholder="Make an ingredients list by new lines or commas."
                           onChange={(e) => (setIngredients(e.currentTarget.value))}/>
                    <CardTitle>Instructions: </CardTitle>
                    <Textarea value={instructions} placeholder="Jot down the instructions."
                              onChange={(e) => (setInstructions(e.currentTarget.value))}/>
                    <Input id="picture"  accept='image/*' onChange={(e) => updateImage(e)} type="file" />
                    {error && <p className='text-red-500 text-sm mt-1'>{error}</p>}
                  </CardHeader>
                  <CardFooter className='gap-3 max-sm:flex-col max-sm:items-stretch'>
                    {edit ? (
                      <Button title="Save" variant='ghost' className="rounded-full" disabled={true}>
                        <Spinner/>
                      </Button>
                    ) : (
                      <>
                        <Button title="Save" onClick={editRecipe(data._id, recipeTitle, cookTime, image, ingredients, instructions)} className="rounded-full">
                          Save
                        </Button>

                        <Button title="Cancel" onClick={() => { setUpdateByUID(""); setConfirmDeletion("");} }
                                className="rounded-full">
                          Cancel
                        </Button>
                      </>
                    )}

                    {confirmDeletion === data._id ? (
                      <>
                        <Button onClick={deleteRecipe(data._id)} title="Delete" variant="destructive" className="uppercase rounded-full">
                          {deleteByUID === data._id ? (<>Deleting <Spinner/></>) : (<>confirm</>)}
                        </Button>

                        <Button onClick={() => { setConfirmDeletion(""); setUpdateByUID("");} } title="Cancel" variant="secondary" className="uppercase rounded-full">
                          cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => deletionCheck(data._id)} title="Delete"  className="rounded-full" variant="destructive">
                          Delete
                        </Button>
                      </> )}
                  </CardFooter>
                </>
              ) : (
                <>
                  <CardHeader>
                    <CardTitle className="font-black uppercase">{data?.recipeTitle}</CardTitle>
                    <CardTitle className="font-black uppercase">{data?.cookTime}</CardTitle>
                    <CardTitle>Ingredients: </CardTitle>
                    <CardDescription className="list-disc pl-10">{listIngredientsTag}</CardDescription>
                    <CardTitle>Instructions: </CardTitle>
                    <CardDescription>{data?.cookInstructions}</CardDescription>
                  </CardHeader>
                  <CardFooter className='gap-3 max-sm:flex-col max-sm:items-stretch'>
                    <Button className="rounded-full" onClick={() => {editAction(data?._id || "", data?.recipeTitle || "", data?.cookTime || "", data?.recipeImage || "", data?.ingredients.toString() || "", data?.cookInstructions || "")}}>Edit</Button>
                    {confirmDeletion === data?._id ? (
                      <>
                        <Button onClick={deleteRecipe(data._id)} title="Delete" variant="destructive" className="uppercase rounded-full">
                          {deleteByUID === data._id ? (<>Deleting <Spinner/></>) : (<>confirm</>)}
                        </Button>

                        <Button onClick={() => setConfirmDeletion("")} title="Cancel" variant="secondary" className="uppercase rounded-full">
                          cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button onClick={() => deletionCheck(data?._id || "")} title="Delete"  className="rounded-full " variant="destructive">
                          Delete
                        </Button>
                      </> )}
                  </CardFooter>
                </>
              )}
            </Card>
          ) : (
            <p className={"text-xl text-black"}>No Recipe was found.</p>
          )
      ):(
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
      )}
    </div>
  )
};

export default ViewRecipe;
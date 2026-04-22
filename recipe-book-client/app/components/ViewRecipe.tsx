'use client';

import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from 'next/navigation';

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
import recipe from "@/recipe";
import {Spinner} from "@/components/ui/spinner";
import {FaRegCheckCircle} from "react-icons/fa";
import {MdOutlineCancel} from "react-icons/md";
import {BsTrash3} from "react-icons/bs";

interface Recipe {
  _id: string;
  recipeTitle: string;
  recipeImage: string;
  cookTime: string
  ingredients: string[];
  cookInstructions: string;
}

interface RecipeProps {
  recipeSlug: string;
}

const ViewRecipe: React.FC<RecipeProps> = ({recipeSlug}) => {
  const [data, setData] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const response = await fetch(`http://localhost:8080/recipes/recipe/${recipeSlug}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }

      const user_data = await response.json();
      setData(user_data);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Failed to get recipe");
    } finally {
      setLoading(false);
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

    let newIngredientList: string[] = [];

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
      const response = await fetch(`http://localhost:8080/recipes/recipe/${recipeUID}`, {
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
        throw Error(response.statusText);
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
      const response = await fetch(`http://localhost:8080/recipes/${recipeUID}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw Error(response.statusText);
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
    getRecipeByRecipeSlug().then(r => console.log(r));
  }, []);

  for (const [index, value] of data?.ingredients.entries() || "No recipes found") {
    listIngredientsTag.push(<li key={index}>{value}</li>)
  }

  //console.log(data)
  //console.log(error);

  if (loading) {
    return (
      <div className="grid place-items-center h-screen">
        <Card className='pt-0'>
          <CardContent className='px-0'>
            <Skeleton className="aspect-video w-[500] h-[500]"/>
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
    <div className="grid place-items-center h-screen">
      <Card className='w-[500]'>
        <CardContent className='pb-0 pt-6'>
          <Image
            src={data?.recipeImage || null || "/placeholder.png"}
            alt={data?.recipeTitle || "Recipe Image"}
            width={500}
            height={500}
            className="rounded-t-xl"
          />
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
    </div>
  )
};

export default ViewRecipe;
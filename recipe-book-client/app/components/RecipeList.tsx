'use client';
import React, {useEffect, useState} from 'react';
import Image from "next/image";
import { useRouter } from 'next/navigation';
import {
  Item,
  ItemContent,
  ItemDescription, ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemTitle,
} from "@/components/ui/item";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Spinner} from "@/components/ui/spinner";
import {PiPencilSimple} from "react-icons/pi";
import {BsTrash3} from "react-icons/bs";
import {FaRegCheckCircle} from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";

interface Recipe {
  _id: string;
  recipeTitle: string;
  recipeImage: string;
  cookTime: string;
  description: string;
  ingredients: string[];
  cookInstructions: string;
}

interface RecipeListProps {
  userId: string;
  refreshTrigger: number; // Number that changes when we want to refresh
}

const RecipeList: React.FC<RecipeListProps> = ({userId, refreshTrigger}) => {
  const [data, setData] = useState<Recipe[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [updateByUID, setUpdateByUID] = useState("");
  const [deleteByUID, setDeleteByUID] = useState("");
  const [error, setError] = useState("");

  const [recipeTitle, setRecipeTitle] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const getUsersRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/recipes/${userId}`, {
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
      setError("Failed to load recipes");
    } finally {
      setLoading(false);
    }
  }

  const editAction = (recipeUID: string, recipeTitle: string, cookTime: string, description: string) => {
    setUpdateByUID(recipeUID);
    setRecipeTitle(recipeTitle);
    setCookTime(cookTime);
    setDescription(description);
    return;
  }

  const editRecipe = (recipeUID: string, recipeTitle: string, cookTime: string, description: string) =>  async () => {
    setEdit(true);

    try {
      const response = await fetch(`http://localhost:8080/recipes/${recipeUID}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeTitle,
          cookTime,
          description
        })
      });

      if (!response.ok) {
        throw Error(response.statusText);
      }

      else if(response.status === 202) {
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
      getUsersRecipes();
      setUpdateByUID("");
      setEdit(false);
    }
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
      getUsersRecipes();
    }
  }

  useEffect(() => {
    if (userId) {
      getUsersRecipes();
    }
  }, [userId, refreshTrigger]); // Re-fetch when refreshTrigger changes

  if (loading) {
    return (
      <div className="w-[70%] flex items-center justify-center">
        <p className="text-xl">Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-[70%] flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-[70%] flex items-center justify-center">
        <p className="text-xl text-gray-500">No recipes yet. Add your first recipe!</p>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[80rem] flex-col gap-6 overflow-auto scrollbar-none p-4">
      <ItemGroup className="grid grid-cols-3 gap-4">
        {data.map((recipe) => (
          <Item key={recipe._id} variant="outline">
            <ItemHeader className="cursor-pointer">
              <Image
                onClick={() => router.push("/recipes/" + recipe._id)}
                src={recipe.recipeImage}
                alt={recipe.recipeTitle}
                width={500}
                height={500}
                className="aspect-square w-full rounded-sm object-cover"
              />
            </ItemHeader>
            {updateByUID === recipe._id ? (
              <>
                <ItemContent>
                  <Input value={recipeTitle} type="text" placeholder="Recipe Title" onChange={(e) => (setRecipeTitle(e.currentTarget.value))}/>
                  <Input value={cookTime} placeholder="Time" onChange={(e) => (setCookTime(e.currentTarget.value))}/>
                  <Input value={description} placeholder="Description" onChange={(e) => (setDescription(e.currentTarget.value))}/>
                </ItemContent>

                <ItemFooter className="flex justify-start">
                  {edit ? (
                    <Button title="Delete" variant='ghost' className="rounded-full " size={"icon"} disabled={true}>
                      <Spinner/>
                    </Button>
                  ) : (
                    <>
                      <Button title="Save" onClick={editRecipe(recipe._id, recipeTitle, cookTime, description)} variant='ghost' className="rounded-full" size={"icon"}>
                        <FaRegCheckCircle className="text-green-500"/>
                      </Button>

                      <Button title="Cancel" onClick={() => setUpdateByUID("")} variant='ghost' className="rounded-full " size={"icon"}>
                        <MdOutlineCancel className="text-red-500"/>
                      </Button>
                    </>
                  )}

                  <Button title="Delete" onClick={deleteRecipe(recipe._id)} size={"icon"} variant={"ghost"} className="rounded-full">
                    {deleteByUID === recipe._id ? (<Spinner/>) : (<BsTrash3 />)}
                  </Button>
                </ItemFooter>
              </>
            ) : (
              <>
                <ItemContent>
                  <ItemTitle>{recipe.recipeTitle}</ItemTitle>
                  <ItemTitle>{recipe.cookTime}</ItemTitle>
                  <ItemDescription>{recipe.description}</ItemDescription>
                </ItemContent>

                <ItemFooter className="flex justify-start">
                  <Button title="Edit" onClick={() => editAction(recipe._id, recipe.recipeTitle, recipe.cookTime, recipe.description)/*() => setUpdateByUID((recipe._id))*/} variant='ghost' className="rounded-full" size={"icon"}>
                    <PiPencilSimple/>
                  </Button>

                  <Button title="Delete" size={"icon"} variant={"ghost"} className="rounded-full">
                    {deleteByUID === recipe._id ? (<Spinner/>) : (<BsTrash3/>)}
                  </Button>
                </ItemFooter>
              </>
            )}
          </Item>
        ))}
      </ItemGroup>
    </div>
  );
};

export default RecipeList;
'use client';
import React, {Dispatch, SetStateAction, useEffect, useState} from 'react';
import Image from "next/image";
import {useRouter} from 'next/navigation';
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
import {MdOutlineCancel} from "react-icons/md";

interface Recipe {
  _id: string;
  recipeTitle: string;
  recipeImage: string;
  cookTime: string;
  description: string;
  cookInstructions: string;
  recipeSlug: string;
}

interface RecipeListProps {
  userId: string;
  refreshTrigger: number; // Number that changes when we want to refresh
}

const RecipeList: React.FC<RecipeListProps> = ({userId, refreshTrigger}) => {
  const [data, setData] = useState<Recipe[] | null>(null);
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] = useState(true);
  const [edit, setEdit] = useState(false);
  const [updateByUID, setUpdateByUID] = useState("");
  const [confirmDelete, setConfirmDelete] = useState("");
  const [deleteByUID, setDeleteByUID] = useState("");
  const [error, setError] = useState("");

  const [recipeTitle, setRecipeTitle] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const getUsersRecipes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${userId}`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        setError(response.statusText || 'Failed to load recipes');
        return;
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
    setConfirmDelete("");
    return;
  }

  const editRecipe = (recipeUID: string, title: string, time: string, description: string) => async () => {
    setEdit(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recipes/${recipeUID}`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeTitle: title,
          description: description,
          cookTime: time,
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
      await getUsersRecipes();
      setUpdateByUID("");
      setEdit(false);
    }
  }

  const deletionCheck = (recipeID: string) => {
    setConfirmDelete(recipeID);
    return;
  }

  const deleteRecipe = async (recipeUID: string) => {
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
      await getUsersRecipes();
      setUpdateByUID("");
      setConfirmDelete("");
    }
  }

  useEffect(() => {
    if (userId) {
      getUsersRecipes();
    }
  }, [userId, refreshTrigger]); // Re-fetch when refreshTrigger changes

  if (loading) {
    return (
      <div className="w-full md:w-[70%] flex items-center justify-center">
        <p className="text-xl">Loading recipes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full md:w-[70%] flex items-center justify-center">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="w-full md:w-[70%] flex items-center justify-center">
        <p className="text-xl text-gray-500">No recipes yet. Add your first recipe!</p>

      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[80rem] flex-col gap-6 overflow-auto scrollbar-none p-4">
      <ItemGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl mx-auto">
        {data.map((recipe) => (
          <Item key={recipe._id} variant="outline">
            <ItemHeader className="cursor-pointer">
              <Image
                onClick={() => router.push("/recipes/recipe/" + recipe.recipeSlug)}
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
                  <Input value={recipeTitle} type="text" placeholder="Recipe Title"
                         onChange={(e) => (setRecipeTitle(e.currentTarget.value))}/>
                  <Input value={cookTime} placeholder="Time" onChange={(e) => (setCookTime(e.currentTarget.value))}/>
                  <Input value={description} placeholder="Description"
                         onChange={(e) => (setDescription(e.currentTarget.value))}/>
                </ItemContent>

                <ItemFooter className="flex justify-start">
                  {edit ? (
                    <Button title="Delete" variant='ghost' className="rounded-full " size={"icon"} disabled={true}>
                      <Spinner/>
                    </Button>
                  ) : (
                    <>
                      <Button title="Save" onClick={editRecipe(recipe._id, recipeTitle, cookTime, description)}
                              variant='ghost' className="rounded-full" size={"icon"}>
                        <FaRegCheckCircle className="text-green-500"/>
                      </Button>

                      <Button title="Cancel" onClick={() => { setUpdateByUID(""); setConfirmDelete("")}} variant='ghost'
                              className="rounded-full " size={"icon"}>
                        <MdOutlineCancel className="text-red-500"/>
                      </Button>
                    </>
                  )}

                  {confirmDelete === recipe._id ? (
                    <>
                      <Button onClick={() => deleteRecipe(recipe._id)} title="Delete" variant="destructive" className="uppercase rounded-full">
                        {deleteByUID === recipe._id ? (<>Deleting <Spinner/></>) : (<>Delete</>)}
                      </Button>

                      <Button onClick={() => { setConfirmDelete(""); setUpdateByUID("")} } title="Cancel" variant="secondary" className="uppercase rounded-full">
                        cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => deletionCheck(recipe._id)} title="Delete" size={"icon"} variant={"ghost"}
                            className="rounded-full hover:text-red-500">
                      <BsTrash3/>
                    </Button>
                  )}
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
                  <Button title="Edit"
                          onClick={() => editAction(recipe._id, recipe.recipeTitle, recipe.cookTime, recipe.description)/*() => setUpdateByUID((recipe._id))*/}
                          variant='ghost' className="rounded-full" size={"icon"}>
                    <PiPencilSimple/>
                  </Button>

                  {confirmDelete === recipe._id ? (
                    <>
                      <Button onClick={() => deleteRecipe(recipe._id)} title="Delete" variant="destructive" className="uppercase rounded-full">
                        {deleteByUID === recipe._id ? (<>Deleting <Spinner/></>) : (<>Delete</>)}
                      </Button>

                      <Button onClick={() => setConfirmDelete("")} title="Cancel" variant="secondary" className="uppercase rounded-full">
                        cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => deletionCheck(recipe._id)} title="Delete" size={"icon"} variant={"ghost"}
                            className="rounded-full hover:text-red-500">
                      <BsTrash3/>
                    </Button>
                  )}
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
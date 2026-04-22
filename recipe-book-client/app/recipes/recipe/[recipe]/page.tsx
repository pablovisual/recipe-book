import React from 'react';
import ViewRecipe from "@/app/components/ViewRecipe";

const Page = async ({params,}: { params: Promise<{ recipe: string }> }) => {
  const { recipe } = await params

  return (
    <ViewRecipe recipeSlug={recipe} />
  )
};

export default Page;
package server.Service;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Service;
import server.Model.Recipe;
import server.Repository.RecipeRepository;

@Service
public class RecipeService {


  @Autowired
  private RecipeRepository recipeRepository;

  public Recipe createRecipe(Recipe recipe) {
    return recipeRepository.save(recipe);
  }
}

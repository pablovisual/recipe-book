package server.Controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.Model.Recipe;
import server.Service.RecipeService;

@RestController
@RequestMapping("/recipes")
public class RecipeController {
  @Autowired
  private RecipeService recipeService;

  @PostMapping
  @CrossOrigin(origins = "http://localhost:3000")
  public ResponseEntity<Recipe> addRecipe(@RequestBody Recipe recipe) {
    Recipe newRecipe = new Recipe(
      recipe.getRecipeTitle(),
      recipe.getIngredients(),
      recipe.getDescription(),
      recipe.getCookInstructions(),
      recipe.getCookTime(),
      recipe.getRecipeImage(),
      recipe.getUser_id()
    );
    return new ResponseEntity<>(recipeService.createRecipe(newRecipe), HttpStatus.CREATED);
  }
}

package server.Controller;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.Model.Recipe;
import server.Service.RecipeService;

import java.util.*;

@RestController
@RequestMapping("/recipes")
public class RecipeController {
  @Autowired
  private RecipeService recipeService;

  @Autowired
  private MongoTemplate mongoTemplate;

  @PostMapping
  @CrossOrigin(origins = "http://localhost:3000")
  public ResponseEntity<Recipe> addRecipe(@RequestBody Recipe recipe) {
    Recipe newRecipe = new Recipe(
      recipe.getRecipeTitle(),
      recipe.getIngredients(),
      recipe.getDescription(),
      recipe.getCookTime(),
      recipe.getCookInstructions(),
      recipe.getRecipeImage(),
      recipe.getUser_id()
    );
    return new ResponseEntity<>(recipeService.createRecipe(newRecipe), HttpStatus.CREATED);
  }

  @GetMapping("/{users_uid}")
  @CrossOrigin(origins = "http://localhost:3000")
  public List<Recipe> getAllRecipesByUID(@PathVariable String users_uid) {
    //Recipe recipes[] = recipeService;
    try {
      final Query query = new Query(Criteria.where("user_id").is(users_uid));
      return mongoTemplate.find(query, Recipe.class);
    }

    catch (Exception e) {
      System.out.println("error occurred.");
      return null;
    }
  }

}

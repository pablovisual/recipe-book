package server.Controller;

import org.apache.coyote.Response;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
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
      recipe.get_id(),
      recipe.getRecipeTitle(),
      recipe.getIngredients(),
      recipe.getDescription(),
      recipe.getCookTime(),
      recipe.getCookInstructions(),
      recipe.getRecipeImage(),
      recipe.getRecipeSlug(),
      recipe.getUser_id()
    );
    return new ResponseEntity<>(recipeService.createRecipe(newRecipe), HttpStatus.CREATED);
  }

  @GetMapping("/recipe/{recipe_slug}")
  @CrossOrigin(origins = "http://localhost:3000")
  public ResponseEntity<Recipe> findRecipeBySlug(@PathVariable String recipe_slug) {
    try {
      final Query query = new Query(Criteria.where("recipeSlug").is(recipe_slug));
      Recipe recipeFound = mongoTemplate.findOne(query, Recipe.class);

      if(recipeFound == null)
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

      return new ResponseEntity<>(recipeFound, HttpStatus.OK);

    } catch (Exception e) {
      System.out.println("An error occurred");
      return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
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

  @PutMapping("/{recipe_uid}")
  @CrossOrigin(origins = "http://localhost:3000")
  public ResponseEntity<?> quickRecipeUpdate(@PathVariable String recipe_uid, @RequestBody Recipe recipe) {
    try {
      final Query query = new Query(Criteria.where("_id").is(recipe_uid));
      final Update update = new Update();
      FindAndModifyOptions options = new FindAndModifyOptions().returnNew(true).upsert(false);

      if(mongoTemplate.findOne(query, Recipe.class) == null)
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

      Recipe foundRecipe = mongoTemplate.findOne(query, Recipe.class);

      if(recipe.getRecipeTitle() != null && !recipe.getRecipeTitle().equals(foundRecipe.getRecipeTitle()))
        update.set("recipeTitle", recipe.getRecipeTitle());

      if(recipe.getCookTime() != null && !recipe.getCookTime().equals(foundRecipe.getCookTime()))
        update.set("cookTime", recipe.getCookTime());

      if(recipe.getDescription() != null && !recipe.getDescription().equals(foundRecipe.getDescription()))
        update.set("description", recipe.getDescription());

      if(update.getUpdateObject().isEmpty())
        return new ResponseEntity<>(HttpStatus.ACCEPTED);

      mongoTemplate.findAndModify(query, update, options, Recipe.class);

    }

    catch (Exception e) {
      throw new RuntimeException(e);
    }
    return new ResponseEntity<>(HttpStatus.OK);
  }

    @PutMapping("/recipe/{recipe_uid}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> updateRecipe(@PathVariable String recipe_uid, @RequestBody Recipe recipe) {
      try {
        final Query query = new Query(Criteria.where("_id").is(recipe_uid));
        final Update update = new Update();
        FindAndModifyOptions options = new FindAndModifyOptions().returnNew(true).upsert(false);

        if(mongoTemplate.findOne(query, Recipe.class) == null)
          return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

        Recipe foundRecipe = mongoTemplate.findOne(query, Recipe.class);

        if(recipe.getRecipeTitle() != null && !recipe.getRecipeTitle().equals(foundRecipe.getRecipeTitle()))
          update.set("recipeTitle", recipe.getRecipeTitle());

        if(recipe.getCookTime() != null && !recipe.getCookTime().equals(foundRecipe.getCookTime()))
          update.set("cookTime", recipe.getCookTime());

        if(recipe.getRecipeImage() != null && !recipe.getRecipeImage().equals(foundRecipe.getRecipeImage()))
          update.set("recipeImage", recipe.getRecipeImage());

        if(recipe.getIngredients() != null && !recipe.getIngredients().equals(foundRecipe.getIngredients()))
          update.set("ingredients", recipe.getIngredients());

        if(recipe.getCookInstructions() != null && !recipe.getCookInstructions().equals(foundRecipe.getCookInstructions()))
          update.set("cookInstructions", recipe.getCookInstructions());

        if(update.getUpdateObject().isEmpty())
          return new ResponseEntity<>(HttpStatus.ACCEPTED);

        mongoTemplate.findAndModify(query, update, options, Recipe.class);
      }

      catch (Exception e) {
        throw new RuntimeException(e);
      }
      return new ResponseEntity<>(HttpStatus.OK);
    }

  @DeleteMapping("/{recipe_uid}")
  @CrossOrigin(origins = "http://localhost:3000")
  public ResponseEntity<?> deleteRecipe(@PathVariable String recipe_uid) {
    try {
      final Query query = new Query(Criteria.where("_id").is(recipe_uid));
      return mongoTemplate.findAndRemove(query, Recipe.class) != null ? new ResponseEntity<>(HttpStatus.OK) : new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    catch (Exception e) {
      System.out.println("error occurred.");
      return null;
    }
  }

}

package server.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.LookupOperation;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import server.Model.User;
import server.Service.UserService;


@RestController
@RequestMapping("/register")
public class UserController {
  @Autowired
  private UserService userService;

  @Autowired
  private MongoTemplate mongoTemplate;

  @PostMapping
  @CrossOrigin(origins = "http://localhost:3000")
  public ResponseEntity<User> createUser(@RequestBody User user) {
    try {
      final Query query = new Query(Criteria.where("email").is(user.getEmail()));

      if(mongoTemplate.findOne(query, User.class) != null)
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);

      User newUser = new User(
        user.get_id(),
        user.getEmail()
      );

      System.out.println(HttpStatus.OK);
      return new ResponseEntity<>(userService.createUser(newUser), HttpStatus.CREATED);
    }

    catch (NullPointerException e) {
      e.printStackTrace();
      return new ResponseEntity<>(HttpStatus.BAD_GATEWAY);
    }
  }

  /*@GetMapping
  public ResponseEntity<User> getAllRecipesByUserIDByLookUp(@RequestBody User user) {
    LookupOperation lookupOperation = LookupOperation.newLookup()
      .from("recipes")
      .localField("_id")
      .foreignField("user_id")
      .as("user's_recipes");
    return null;
  }*/
}

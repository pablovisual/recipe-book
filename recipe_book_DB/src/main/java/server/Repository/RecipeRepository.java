package server.Repository;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import server.Model.Recipe;

@Repository
public interface RecipeRepository extends MongoRepository<Recipe, ObjectId> {
}

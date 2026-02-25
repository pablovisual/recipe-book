package server.Model;

import com.mongodb.lang.NonNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.codecs.pojo.annotations.BsonId;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "recipes")
public class Recipe {
  @BsonId
  private String _id;
  private String recipeTitle;
  private String[] ingredients;
  private String description;
  private String cookTime;
  private String cookInstructions;
  private String recipeImage;
  private String user_id;
}

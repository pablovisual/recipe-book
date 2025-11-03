package server.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import server.Model.User;
import server.Repository.UserRepository;

import java.util.Optional;

@Service
public class UserService {
  @Autowired
  private UserRepository userRepository;

  public User createUser(User user) {
    return userRepository.save(user);
  }

  public Optional<User> fingUserById(User user) {
    return userRepository.findById(user.get_id());
  }
}

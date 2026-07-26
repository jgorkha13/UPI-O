//About this package
// The only layer that talks to the database
        //Extends JpaRepository — gives free save, findById, findAll, delete
        //Added findByPhone() — Spring auto-generates SQL from method name
       // Added existsByPhone() — checks if phone already registered


package paymentsystem.repository;

import paymentsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByPhone(String phone);

    boolean existsByPhone(String phone);
}
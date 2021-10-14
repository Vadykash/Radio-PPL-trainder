package com.example.RadioPPL;

//import TUsers.*;

import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends CrudRepository<TUsers, Long> {
    List<TUsers> findByName(String name);
}
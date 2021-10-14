package com.example.RadioPPL;

import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

@Repository
public interface UserWavRepository extends CrudRepository<TUserWavs, Long> {
}

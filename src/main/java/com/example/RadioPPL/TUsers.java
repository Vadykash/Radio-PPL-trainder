package com.example.RadioPPL;

import javax.persistence.*;

import lombok.Getter;
import lombok.Setter;

import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "Users1")
public class TUsers {
   @Id
   @GeneratedValue(strategy = GenerationType.AUTO)
   @Getter
   @Setter
   private Long id;

   @Getter
   @Setter
   @Column(name = "name")
   private String name;

   @Getter
   //@OneToMany(optional=false, cascade=CascadeType.ALL)
   @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
   //@ManyToOne(optional = false, cascade = CascadeType.ALL)
   private List<TUserWavs> user_wavs;

   TUsers(String name) {
      this.setName(name);
   }

   TUsers() {}
}

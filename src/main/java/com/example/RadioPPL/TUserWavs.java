package com.example.RadioPPL;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "User_Wavs")
public class TUserWavs {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    @Setter
    @Column(name="id")
    private Long id;


    @Getter
    @Setter
    @Column(name = "write_time")
    private LocalDateTime date_time;

    @Getter
    @Setter
    @Column(name = "wav")
    private byte[] wav;
/*
    @Getter
    @Setter
    @Column(name = "info")
    private String info;
*/
    //@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private TUsers user;

    TUserWavs(TUsers user, byte[] wav) {
        this.user = user;
        //this.info = "test";
        //this.wav = wav.getBytes(StandardCharsets.UTF_8);
        this.wav = wav;
        date_time = LocalDateTime.now();
    }

    TUserWavs() {}
}

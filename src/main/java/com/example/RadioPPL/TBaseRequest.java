package com.example.RadioPPL;

//import com.fasterxml.jackson.annotation.JsonPropertyOrder;
//import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

public class TBaseRequest {
    @Getter
    @Setter
    private String wav;

    @Getter
    @Setter
    private String smth;
//    TBaseRequest(String wav_, String smth_) {
//        wav = wav_;
//        smth = smth;
//    }

    @Getter
    @Setter
    private String name;

    TBaseRequest() {}

    public int length() {
        return wav.length();
    }
}


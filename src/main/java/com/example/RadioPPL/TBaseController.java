package com.example.RadioPPL;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;

import com.fasterxml.jackson.databind.util.JSONPObject;
import org.springframework.boot.*;
import org.springframework.stereotype.*;            // for cotroller
import org.springframework.web.bind.annotation.*;

import org.slf4j.LoggerFactory;
import org.slf4j.Logger;
//import TBaseRequest.*;
import org.springframework.http.MediaType;

import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Base64;

import org.json.JSONArray;
import org.json.JSONObject;

//import TUsers.TUsers;

@Controller
public class TBaseController {

    static Logger logger = LoggerFactory.getLogger(TBaseController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserWavRepository userWavRepository;

    @RequestMapping("/")
    String home(@CookieValue(value = "user", defaultValue = "") String user_name_cookie) {
        //if (!user_name_cookie.isEmpty()) {
        //}
        return "index.html";
    }


    @RequestMapping(
        value = "user_records.json",
        method = RequestMethod.POST,
        consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE}
    )
    @ResponseBody
    String userRecords(@RequestBody TUserRecordsRequest req) {
        List<TUsers> user_list = userRepository.findByName(req.getName());
        JSONArray ja = new JSONArray();

        if (!user_list.isEmpty()) {
            TUsers user = user_list.get(0);
            List<TUserWavs> user_wavs = user.getUser_wavs();

            for (TUserWavs uw : user_wavs) {
                JSONObject obj = new JSONObject();
                obj.put("id", uw.getId());
                obj.put("time", uw.getDate_time());
                ja.put(obj);
            }
        }
        return ja.toString();
    }

    @RequestMapping(
        value = "data.json",
        method = RequestMethod.POST
    )
    @ResponseBody
    String resp(@CookieValue(value = "user", defaultValue = "") String user_name_cookie, @RequestBody TBaseRequest req) {
    //String resp(@RequestBody String req) {
        //logger.info("Receive data, data len: " + req.length());
        logger.info("Receive data, data len: ");

        Integer len = req.length();
        String user_name = req.getName();
        logger.info("VAD_0001: " + user_name);
        List<TUsers> user_list = userRepository.findByName(user_name);
        logger.info("VAD_0002");
        TUsers user = null;
        if (user_list.isEmpty()) {
            logger.info("VAD_0002444");
            userRepository.save(new TUsers(req.getName()));
            logger.info("VAD_8888");
            user_list = userRepository.findByName(user_name);
            user = user_list.get(0);
            logger.info("VAD_0002444 user_id: " + user.getId());
        } else {
            logger.info("VAD_0003");
            user_list = userRepository.findByName(user_name);
            user = user_list.get(0);
            logger.info("VAD_0004");
        }

        logger.info("Start creating user wavs");
        byte[] wav = Base64.getDecoder().decode(req.getWav().getBytes(StandardCharsets.UTF_8));
        TUserWavs userWavs = new TUserWavs(user, wav);
        logger.info("user wav created, try to save to db");

        userWavRepository.save(userWavs);
        logger.info("!!! saving complete");

        return "index.html";
    }
}

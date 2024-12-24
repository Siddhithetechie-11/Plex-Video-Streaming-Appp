package com.stream.app.services;

import com.stream.app.entities.Video;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface VideoService {

    //Save video
    Video save(Video video, MultipartFile file);

    //get video by id
    Video get(String videoId);

    //get video by title
    Video getByTitle(String title);

    //get all video
    List<Video> getAll();

    //video processing
    String processVideo(String videoId);
}

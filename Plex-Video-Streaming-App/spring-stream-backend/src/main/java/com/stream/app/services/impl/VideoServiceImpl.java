package com.stream.app.services.impl;

import com.stream.app.entities.Video;
import com.stream.app.repositories.VideoRepository;
import com.stream.app.services.VideoService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class VideoServiceImpl implements VideoService {

    @Value("${files.video}")
    String DIR;
    @Value("${file.video.hsl}")
    String HSL_DIR;

    private VideoRepository videoRepository;

    public VideoServiceImpl(VideoRepository videoRepository){
        this.videoRepository = videoRepository;
    }

    @PostConstruct
    public void init(){
        File file = new File(DIR);
        try{
            Files.createDirectories(Paths.get(HSL_DIR));
        }catch(IOException e){
            throw new RuntimeException(e);
        }
        if(!file.exists()){
            file.mkdir();
            System.out.println("Folder Created");
        }else{
            System.out.println("Folder Already Exists");
        }
    }

    @Override
    public Video save(Video video, MultipartFile file) {

        try{
            String filename = file.getOriginalFilename();
            String contentType = file.getContentType();
            InputStream inputStream = file.getInputStream();
            //file path
            String cleanFileName = StringUtils.cleanPath(filename);
            //Folder Path : create
            String cleanFolder = StringUtils.cleanPath(DIR);
            //Folder path with filename
            Path path = Paths.get(cleanFolder, cleanFileName);
            System.out.println(contentType);
            System.out.println(path);
            //copy file to the folder
            Files.copy(inputStream, path, StandardCopyOption.REPLACE_EXISTING);
            //video meta data
            video.setContentType(contentType);
            video.setFilePath(path.toString());
            Video savedVideo = videoRepository.save(video);
            //Process Video!!!
            processVideo(savedVideo.getVideoId());
            //In the future : Delete actual video file and database entry if exception

            return savedVideo;
        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Error in processing video ..... ");
        }

        //return null;
    }

    @Override
    public Video get(String videoId) {
        return videoRepository.findById(videoId).orElseThrow(() -> new RuntimeException("Video not found"));
    }

    @Override
    public Video getByTitle(String title) {
        return videoRepository.findByTitle(title).orElseThrow(() -> new RuntimeException("Video not found"));
    }

    @Override
    public List<Video> getAll() {
        return videoRepository.findAll();
    }

    @Override
    public String processVideo(String videoId) {

        Video video = this.get(videoId);
        String filePath = video.getFilePath();
        //Path where data is stored
        Path videoPath = Paths.get(filePath);

        try{
            Path outputPath = Paths.get(HSL_DIR, videoId);
            Files.createDirectories(outputPath);
            String ffmpegCmd = String.format(
                    "ffmpeg -i \"%s\" -c:v libx264 -c:a aac -strict -2 -f hls -hls_time 10 -hls_list_size 0 -hls_segment_filename \"%s/segment_%%3d.ts\"  \"%s/master.m3u8\" ",
                    videoPath, outputPath, outputPath
            );
            System.out.println(ffmpegCmd);
            ProcessBuilder processBuilder = new ProcessBuilder("/bin/bash", "-c", ffmpegCmd);
            processBuilder.inheritIO();
            Process process = processBuilder.start();
            int exit = process.waitFor();
            if(exit != 0){
                throw new RuntimeException("video processing failed!!!");
            }

        }catch (IOException e) {
            throw new RuntimeException(e);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        return null;
    }
}

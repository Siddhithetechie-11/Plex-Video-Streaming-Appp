import React, { useEffect, useState } from "react";
import videoLogo from "../assets/upload.png";
import toast from "react-hot-toast";
import {
  Button,
  Card,
  TextInput,
  Label,
  Textarea,
  Alert,
  Progress,
} from "flowbite-react";
import axios from "axios";

const VideoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
  });
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  //title and description change hone pe
  const formFieldChange = (event) => {
    setMeta({
      ...meta,
      [event.target.name]: event.target.value,
    });
    //console.log(meta);
  };
  //File change handle
  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  //Form ko handle kro jab submit click ho
  const handleForm = (formEvent) => {
    formEvent.preventDefault();
    console.log(formEvent);
    if (!selectedFile) {
      alert("Please select file !!!");
      return;
    }
    saveVideoToServer(selectedFile, meta);
  };

  //Reset form
  const resertForm = () => {
    setMeta({
      title: "",
      description: "",
    });
    setSelectedFile(null);
    setUploading(false);
  };

  //Server me file ko dalo
  const saveVideoToServer = async (video, videoMetaData) => {
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", videoMetaData.title);
      formData.append("description", videoMetaData.description);
      formData.append("file", selectedFile);

      const response = await axios.post(
        `http://localhost:8080/api/v1/videos`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const xprogress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log("xProgress:", xprogress + "%");

            setProgress(xprogress);
          },
        }
      );
      console.log(response);
      setProgress(0);
      setMessage("File uploaded with video Id " + response?.data?.videoId);
      setUploading(false);
      toast.success("Video uploaded successfully !!!");
      resertForm();
    } catch (e) {
      console.log(e);
      setMessage("Error in uplaoding File");
      setUploading(false);
    }
  };

  return (
    <div className="text-white">
      <Card className="flex flex-col space-y-6">
        <h1>Upload Videos</h1>
        <div>
          <form className="flex flex-col space-y-6" onSubmit={handleForm}>
            <div>
              {/* Title */}
              <div className="mb-2 block">
                <Label htmlFor="file-upload" value="Video Title" />
              </div>
              <TextInput
                value={meta.title}
                name="title"
                onChange={formFieldChange}
                placeholder="Enter title"
              />
            </div>
            <div>
              {/* Description */}
              <div className="mb-2 block">
                <Label htmlFor="comment" value="Video Description" />
              </div>
              <Textarea
                value={meta.description}
                name="description"
                id="comment"
                onChange={formFieldChange}
                placeholder="Write video description..."
                required
                rows={4}
              />
            </div>
            <div className="flex items-end space-x-5 justify-center">
              {/* File Input */}
              <div className="shrink-0">
                <img
                  className="h-16 w-16 object-cover"
                  src={videoLogo}
                  alt="Current profile photo"
                />
              </div>
              <label className="block">
                <span className="sr-only">Choose video file</span>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-violet-50 file:text-violet-700
                    hover:file:bg-violet-100
                    "
                />
              </label>
            </div>
            <div>
              {uploading && (
                <Progress
                  color="red"
                  progress={progress}
                  textLabel="uploading"
                  size="lg"
                  labelProgress
                  labelText
                />
              )}
            </div>
            <div>
              {message && (
                <Alert
                  color="success"
                  rounded
                  withBorderAccent
                  onDismiss={() => setMessage("")}
                >
                  <span>{message}</span>
                </Alert>
              )}
            </div>
            <div className="flex justify-center">
              {/* Upload Button */}
              <Button disabled={uploading} type="submit">
                Upload
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default VideoUpload;

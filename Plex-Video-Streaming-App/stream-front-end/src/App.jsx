import { Toaster } from "react-hot-toast";
import "./App.css";
import VideoUpload from "./components/VideoUpload";
import { useState } from "react";
import VideoPlayer from "./components/VideoPlayer";
import { TextInput, Button } from "flowbite-react";

function App() {
  const [videoId, setVideoId] = useState(
    "1c73b343-8fbb-4837-a8f7-f2d95316e558"
  );
  const [fieldValue, setFieldValue] = useState(null);

  return (
    <>
      <Toaster />
      <div className="flex flex-col items-center space-y-9 justify-center py-9">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-[#EB5569]">
          Video Streaming App!!!
        </h2>
        <div className="flex mt-14 space-x-40 justify-between">
          <div className="">
            {/* video player */}
            <h1 className="text-white text-center mt-2">Playing Video</h1>
            {/* <video
              style={{
                width: "720px",
                height: "360px",
              }}
              src={`http://localhost:8080/api/v1/videos/stream/range/${videoId}`}
              controls
            ></video> */}
            <VideoPlayer
              src={`http://localhost:8080/api/v1/videos/${videoId}/master.m3u8`}
            ></VideoPlayer>
          </div>
          <div>
            {/* Video upload */}
            <VideoUpload />
          </div>
        </div>
        <div className="my-4 flex  space-x-4">
          <TextInput
            onChange={(event) => {
              setFieldValue(event.target.value);
            }}
            placeholder="Enter video id here"
            name="video_id_field"
          />
          <Button
            onClick={() => {
              setVideoId(fieldValue);
            }}
          >
            Play
          </Button>
        </div>
      </div>
    </>
  );
}

export default App;

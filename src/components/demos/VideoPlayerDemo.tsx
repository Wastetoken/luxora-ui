import { VideoPlayer, VideoPlayerControlBar, VideoPlayerPlayButton, VideoPlayerTimeRange, VideoPlayerTimeDisplay, VideoPlayerVolumeRange } from "@/components/repo/skiper67";

const VideoPlayerDemo = () => {
  return (
    <div className="w-full h-full bg-neutral-950 flex items-center justify-center p-8">
      <VideoPlayer style={{ width: "100%", maxWidth: 640, aspectRatio: "16/9" }}>
        <video
          slot="media"
          src="https://stream.mux.com/A3VXy02VoUinw01pwyomEO3bHnG00gFiqki04cUqCMtlJA4/low.mp4"
          crossOrigin=""
        />
        <VideoPlayerControlBar>
          <VideoPlayerPlayButton />
          <VideoPlayerTimeRange />
          <VideoPlayerTimeDisplay showDuration />
          <VideoPlayerVolumeRange />
        </VideoPlayerControlBar>
      </VideoPlayer>
    </div>
  );
};

export default VideoPlayerDemo;

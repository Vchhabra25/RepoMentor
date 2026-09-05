import { useEffect, useRef, useState } from "react";

const BackgroundMusic = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const startMusic = () => {
    if (!audioRef.current) return;

    audioRef.current.play();
    setPlaying(true);
  };

  const stopMusic = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    setPlaying(false);
  };

  useEffect(() => {
    const audio = new Audio("/calm.mp3");
    audio.oncanplaythrough = () => {
  console.log("Audio Loaded");
};

audio.onerror = () => {
  console.log("Audio Failed");
};

    audio.loop = true;
    audio.volume = 1;

    audioRef.current = audio;

    return () => {
      audio.pause();
    };
  }, []);

  return (
    <button
      onClick={playing ? stopMusic : startMusic}
      className="fixed bottom-5 right-5 z-50 bg-indigo-600 text-white px-4 py-2 rounded-full shadow-lg"
    >
      {playing ? "🔇 Stop Ambience" : "🔊 Start Ambience"}
    </button>
  );
};

export default BackgroundMusic;
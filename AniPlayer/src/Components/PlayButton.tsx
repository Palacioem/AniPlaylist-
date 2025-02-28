import { ActionIcon } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';
import { useEffect, useRef, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

type PlayButtonProps = {
  previewUrl: string | null;
};

function PlayButton({ previewUrl }: PlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loading, { toggle }] = useDisclosure();

  useEffect(() => {
    if (previewUrl) {
      if (!audioRef.current) {
        audioRef.current = new Audio(previewUrl);
      } else {
        audioRef.current.src = previewUrl; // Update source instead of re-creating
      }

      // Listen for when the audio ends to reset state
      audioRef.current.onended = () => setIsPlaying(false);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null; // Cleanup event listener
      }
    };
  }, [previewUrl]);

  const handlePlay = () => {
    if (!audioRef.current) {
      console.log('empty') 
      toggle();
      return;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Playback error:", err)); // Handle play issues
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <ActionIcon 
      variant="outline" 
      size="lg" 
      onClick={handlePlay}
      loading={loading}
    >
      {isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
    </ActionIcon>
  );
}

export default PlayButton;

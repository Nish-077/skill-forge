import React, { useState, useEffect, useRef, useCallback } from 'react';

const useYouTubeAPI = () => {
    const [apiReady, setApiReady] = useState(false);

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            if (firstScriptTag && firstScriptTag.parentNode) {
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }

            (window as any).onYouTubeIframeAPIReady = () => setApiReady(true);
        } else {
            setApiReady(true);
        }
    }, []);

    return apiReady;
};

interface YouTubeEmbedProps {
    videoUrl: string;
    onTimeUpdate?: (videoId: string | null, time: number) => void;
    initialWatchTime?: number;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoUrl, onTimeUpdate, initialWatchTime = 0 }) => {
    const playerRef = useRef<HTMLDivElement>(null);
    const playerInstanceRef = useRef<YT.Player | null>(null);
    const intervalRef = useRef<number | null>(null);
    const [watchedTime, setWatchedTime] = useState(initialWatchTime);
    const apiReady = useYouTubeAPI();
    const currentVideoIdRef = useRef<string | null>(null);
    const initialSeekPerformedRef = useRef<boolean>(false);
    const lastKnownTimeRef = useRef<number>(initialWatchTime);

    const getVideoId = useCallback((url: string) => {
        try {
            const urlObj = new URL(url);
            return urlObj.searchParams.get('v') || urlObj.pathname.slice(1);
        } catch (error) {
            console.error('Invalid URL:', url);
            return null;
        }
    }, []);

    const clearInterval = useCallback(() => {
        if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const onPlayerStateChange = useCallback((event: YT.OnStateChangeEvent) => {
        const videoId = currentVideoIdRef.current;
        if (event.data === (window as any).YT.PlayerState.PLAYING) {
            if (!initialSeekPerformedRef.current) {
                event.target.seekTo(lastKnownTimeRef.current, true);
                initialSeekPerformedRef.current = true;
            }
            clearInterval();
            intervalRef.current = window.setInterval(() => {
                const currentTime = event.target.getCurrentTime();
                if (currentTime < lastKnownTimeRef.current) {
                    event.target.seekTo(lastKnownTimeRef.current, true);
                } else {
                    lastKnownTimeRef.current = currentTime;
                    setWatchedTime(currentTime);
                    if (videoId) {
                        onTimeUpdate?.(videoId, currentTime);
                    }
                }
            }, 1000);
        } else if (event.data === (window as any).YT.PlayerState.PAUSED || event.data === (window as any).YT.PlayerState.ENDED) {
            clearInterval();
            lastKnownTimeRef.current = event.target.getCurrentTime();
        }
    }, [clearInterval, onTimeUpdate]);

    const initializePlayer = useCallback(() => {
        const videoId = getVideoId(videoUrl);
        if (!videoId || videoId === currentVideoIdRef.current) return;

        currentVideoIdRef.current = videoId;
        initialSeekPerformedRef.current = false;
        lastKnownTimeRef.current = initialWatchTime;
    
        if (apiReady && playerRef.current) {
            if (playerInstanceRef.current) {
                playerInstanceRef.current.loadVideoById({
                    videoId: videoId,
                    startSeconds: lastKnownTimeRef.current
                });
            } else {
                playerInstanceRef.current = new (window as any).YT.Player(playerRef.current, {
                    videoId: videoId,
                    playerVars: {
                        autoplay: 0,
                        controls: 1,
                        start: Math.floor(lastKnownTimeRef.current)
                    },
                    events: {
                        'onReady': (event: YT.PlayerEvent) => {
                            console.log("Player is ready");
                        },
                        'onStateChange': onPlayerStateChange
                    }
                });
            }
        }
    }, [apiReady, videoUrl, onPlayerStateChange, getVideoId, initialWatchTime]);

    useEffect(() => {
        if (apiReady) {
            initializePlayer();
        }
    }, [apiReady, initializePlayer]);

    useEffect(() => {
        return () => {
            clearInterval();
            if (playerInstanceRef.current) {
                playerInstanceRef.current.destroy();
            }
        };
    }, [clearInterval]);

    return (
        <div ref={playerRef} className="w-full h-full rounded-2xl px-2 py-2 youtube-embed"></div>
    );
};

export default YouTubeEmbed;
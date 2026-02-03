'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, SkipBack, SkipForward } from 'lucide-react';

interface PodcastPlayerProps {
    title: string;
    audioUrl: string;
    duration?: string;
    imageUrl?: string;
}

export default function PodcastPlayer({ title, audioUrl, duration, imageUrl }: PodcastPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [durationSec, setDurationSec] = useState(0);
    const [volume, setVolume] = useState(1);

    const audioRef = useRef<HTMLAudioElement>(null);
    const progressBarRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setDurationSec(audio.duration);
        };

        const setAudioTime = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleEnded = () => setIsPlaying(false);

        audio.addEventListener('loadedmetadata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('loadedmetadata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleProgressChange = () => {
        if (!audioRef.current || !progressBarRef.current) return;
        const newTime = Number(progressBarRef.current.value);
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const handleSkip = (seconds: number) => {
        if (!audioRef.current) return;
        audioRef.current.currentTime += seconds;
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    // Styling logic
    const progressPercent = durationSec ? (currentTime / durationSec) * 100 : 0;

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden max-w-3xl mx-auto my-8">
            <audio ref={audioRef} src={audioUrl} preload="metadata" />

            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">

                {/* Cover Album/Episode */}
                <div className="w-32 h-32 flex-shrink-0 bg-gray-200 rounded-xl overflow-hidden shadow-inner relative">
                    {/* Replace simple img with Next Image in real usage */}
                    {imageUrl ? (
                        <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/20 text-secondary">
                            🎙️
                        </div>
                    )}
                    {/* Circular Play Button Overlay on Image for style */}
                    <button
                        onClick={togglePlay}
                        className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors group"
                    >
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                            {isPlaying ? <Pause size={16} className="text-gray-900 fill-current" /> : <Play size={16} className="text-gray-900 fill-current ml-1" />}
                        </div>
                    </button>
                </div>

                {/* Controls & Infos */}
                <div className="flex-1 w-full space-y-4">
                    <div className="text-center md:text-left">
                        <span className="text-xs uppercase tracking-wider text-secondary font-bold">Écouter l'épisode</span>
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 mt-1">{title}</h3>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                        <div className="relative w-full h-2 bg-gray-100 rounded-full cursor-pointer group">
                            <div
                                className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-100"
                                style={{ width: `${progressPercent}%` }}
                            />
                            <input
                                type="range"
                                ref={progressBarRef}
                                min="0"
                                max={durationSec || 100}
                                value={currentTime}
                                onChange={handleProgressChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500 font-mono">
                            <span>{formatTime(currentTime)}</span>
                            <span>{durationSec ? formatTime(durationSec) : (duration || "00:00")}</span>
                        </div>
                    </div>

                    {/* Main Controls */}
                    <div className="flex items-center justify-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => handleSkip(-15)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="-15s">
                                <SkipBack size={20} />
                            </button>

                            <button
                                onClick={togglePlay}
                                className="w-12 h-12 flex items-center justify-center bg-secondary text-white rounded-full shadow-md hover:bg-secondary/90 hover:scale-105 transition-all"
                            >
                                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
                            </button>

                            <button onClick={() => handleSkip(15)} className="p-2 text-gray-400 hover:text-gray-600 transition-colors" title="+15s">
                                <SkipForward size={20} />
                            </button>
                        </div>

                        {/* Volume - Hidden on small mobile */}
                        <div className="hidden md:flex items-center gap-2 group">
                            <Volume2 size={16} className="text-gray-400" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={(e) => {
                                    const val = Number(e.target.value);
                                    setVolume(val);
                                    if (audioRef.current) audioRef.current.volume = val;
                                }}
                                className="w-20 h-1 bg-gray-200 rounded-full accent-gray-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

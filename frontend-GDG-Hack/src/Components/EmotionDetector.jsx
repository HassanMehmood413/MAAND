import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';

const EmotionDetector = ({ onEmotionDetected }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('');

  useEffect(() => {
    loadModels();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const loadModels = async () => {
    try {
      setLoadingStatus('Loading face detection models...');
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      setLoadingStatus('Models loaded successfully');
      console.log('Face detection models loaded');
    } catch (err) {
      console.error('Error loading models:', err);
      setError('Failed to load face detection models. Please refresh the page.');
      setLoadingStatus('Error loading models');
    }
  };

  const startVideo = async () => {
    try {
      if (!faceapi.nets.tinyFaceDetector.isLoaded) {
        setError('Face detection models are not loaded yet. Please wait.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Failed to access camera. Please ensure camera permissions are granted.');
      setIsCameraActive(false);
    }
  };

  const stopVideo = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraActive(false);
    }
  };

  const handleVideoPlay = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const displaySize = { width: videoRef.current.width, height: videoRef.current.height };
    faceapi.matchDimensions(canvas, displaySize);

    const detectEmotions = async () => {
      if (!isCameraActive) return;

      try {
        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        if (resizedDetections.length > 0) {
          const emotions = resizedDetections[0].expressions;
          const dominantEmotion = Object.entries(emotions).reduce((a, b) => (a[1] > b[1] ? a : b));
          
          if (onEmotionDetected) {
            onEmotionDetected({
              emotion: dominantEmotion[0],
              confidence: dominantEmotion[1],
              allEmotions: emotions
            });
          }
        }
      } catch (err) {
        console.error('Error detecting emotions:', err);
        setError('Error detecting emotions. Please try again.');
      }
    };

    const interval = setInterval(detectEmotions, 100);
    return () => clearInterval(interval);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onPlay={handleVideoPlay}
          className="w-full rounded-lg"
          style={{ display: isCameraActive ? 'block' : 'none' }}
        />
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full"
          style={{ display: isCameraActive ? 'block' : 'none' }}
        />
      </div>

      <div className="mt-4 flex flex-col items-center gap-4">
        <button
          onClick={isCameraActive ? stopVideo : startVideo}
          disabled={loadingStatus === 'Loading face detection models...'}
          className={`px-6 py-2 rounded-full font-medium transition-all ${
            isCameraActive
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-[#00FFB2] hover:bg-[#00E6A0] text-black'
          } ${loadingStatus === 'Loading face detection models...' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isCameraActive ? 'Stop Camera' : 'Start Camera'}
        </button>

        {loadingStatus && (
          <p className="text-sm text-gray-500">{loadingStatus}</p>
        )}

        {error && (
          <p className="text-sm text-red-500 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
};

export default EmotionDetector; 
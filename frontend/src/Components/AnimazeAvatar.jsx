import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import { RPMAvatar } from '@readyplayerme/visage';

const AnimazeModel = ({ expression, speaking }) => {
  const avatarRef = useRef();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    const initializeAvatar = async () => {
      try {
        const rpm = new RPMAvatar({
          subdomain: 'demo', // Replace with your subdomain
          canvas: avatarRef.current,
          quality: 'high',
          useHiRes: true,
        });

        await rpm.init();
        setAvatar(rpm);

        // Load default avatar or user's custom avatar
        await rpm.loadAvatar('https://models.readyplayer.me/default.glb');
      } catch (error) {
        console.error('Failed to initialize avatar:', error);
      }
    };

    initializeAvatar();

    return () => {
      if (avatar) {
        avatar.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (!avatar) return;

    // Map expressions to Animaze blend shapes
    const expressionMap = {
      happy: { smileRight: 1, smileLeft: 1, eyeSquintRight: 0.4, eyeSquintLeft: 0.4 },
      sad: { mouthFrownRight: 1, mouthFrownLeft: 1, browsDownRight: 0.5, browsDownLeft: 0.5 },
      neutral: {},
      thinking: { browsUpRight: 0.7, eyeSquintRight: 0.3, mouthRight: 0.4 },
      excited: { smileRight: 1, smileLeft: 1, browsUpRight: 1, browsUpLeft: 1 },
      speaking: { jawOpen: 0.3 }
    };

    // Apply expression blend shapes
    const currentExpression = expressionMap[expression] || {};
    Object.entries(currentExpression).forEach(([shape, value]) => {
      avatar.setBlendShape(shape, value);
    });

    // Add speaking animation if needed
    if (speaking) {
      let jawValue = 0;
      const animateJaw = () => {
        if (!speaking) return;
        jawValue = Math.sin(Date.now() / 100) * 0.3 + 0.3;
        avatar.setBlendShape('jawOpen', jawValue);
        requestAnimationFrame(animateJaw);
      };
      animateJaw();
    }
  }, [avatar, expression, speaking]);

  return (
    <div ref={avatarRef} style={{ width: '100%', height: '100%' }} />
  );
};

const AnimazeAvatar = ({ expression = 'neutral', speaking = false }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas
        camera={{ position: [0, 1.5, 3], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimazeModel expression={expression} speaking={speaking} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2.2}
          maxPolarAngle={Math.PI / 1.8}
        />
      </Canvas>
    </div>
  );
};

export default AnimazeAvatar; 
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { ImagePanorama, Viewer } from 'panolens';

const PanoramaViewer = () => {
  useEffect(() => {
    const panoramaImage = new ImagePanorama('./images/image2.jpg');

    const imageContainer = document.querySelector('.image-container');

    const viewer = new Viewer({
      container: imageContainer,
      autoRotate: true,
      autoRotateSpeed: 0.3,
      controlBar: false,
    });

    viewer.add(panoramaImage);

    return () => {
      // Clean up Panolens objects or event listeners if needed
    };
  }, []); // Empty dependency array to ensure the effect runs only once

  return (
    <div className="main-container">
      <h1>Hi, Welcome</h1>
      <div className="image-container"></div>
    </div>
  );
};

export default PanoramaViewer;

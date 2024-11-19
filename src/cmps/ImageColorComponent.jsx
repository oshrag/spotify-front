import React, { useEffect, useState } from "react";
import { FastAverageColor } from "fast-average-color";

const colorCache = {};

const ImageColorComponent = ({ imageUrl, onColorChange }) => {
  useEffect(() => {
    const fac = new FastAverageColor();

    const cachedColor = getCachedColor(imageUrl);
    if (cachedColor) {
      onColorChange(cachedColor);
      return;
    }

    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const targetUrl = imageUrl;

    fetch(proxyUrl + targetUrl, {
      headers: {
        "x-requested-with": "XMLHttpRequest",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const img = new Image();
        img.src = URL.createObjectURL(blob);
        img.crossOrigin = "Anonymous";

        img.onload = () => {
          fac
            .getColorAsync(img)
            .then((color) => {
              const colorData = {
                backgroundColor: color.rgba,
                color: color.isDark ? "#fff" : "#000",
              };

              setCachedColor(imageUrl, colorData);
              onColorChange(colorData);
            })
            .catch((e) => {
              console.error(e);
            });
        };
      })
      .catch((error) => {
        console.error("Error fetching the image:", error);
      });
  }, [imageUrl]);

  const getCachedColor = (imageUrl) => {
    const cachedData = localStorage.getItem(imageUrl);
    return cachedData ? JSON.parse(cachedData) : null;
  };

  const setCachedColor = (imageUrl, colorData) => {
    localStorage.setItem(imageUrl, JSON.stringify(colorData));
  };

  return (
    <div>
      <img src={imageUrl} alt="Example" style={{ display: "none" }} />
    </div>
  );
};

export default ImageColorComponent;

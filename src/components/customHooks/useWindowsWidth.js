import { useState, useEffect } from "react";
// для замера ширины экрана.
export default function useWindowsWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const updateDimensions = () => {
      setWidth(window.innerWidth);
    };
    window.addEventListener("resize", updateDimensions);
    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  });
  return width;
}

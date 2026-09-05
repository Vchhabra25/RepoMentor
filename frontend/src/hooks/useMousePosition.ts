import { useEffect, useState } from "react";

interface Position {
  x: number;
  y: number;
}

/**
 * Tracks pointer position relative to a container element.
 * Used to drive the ambient "signal glow" behind the landing hero.
 */
export function useMousePosition() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(event: MouseEvent) {
      setPosition({ x: event.clientX, y: event.clientY });
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return position;
}

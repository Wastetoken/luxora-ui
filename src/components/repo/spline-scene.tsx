/**
 * Spline 3D Scene Viewer
 * Renders an interactive 3D scene from Spline.
 * 
 * Original scene: https://prod.spline.design/sQKe4kxs7WH0GmOr/scene.splinecode
 * Built with Spline (https://spline.design)
 */

import Spline from '@splinetool/react-spline';

interface SplineSceneProps {
  scene?: string;
  className?: string;
}

export const SplineScene = ({
  scene = "https://prod.spline.design/sQKe4kxs7WH0GmOr/scene.splinecode",
  className,
}: SplineSceneProps) => {
  return (
    <div className={className ?? "w-full h-screen bg-black"}>
      <Spline scene={scene} />
    </div>
  );
};

export default SplineScene;

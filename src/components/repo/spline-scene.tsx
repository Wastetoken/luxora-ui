/**
 * Spline 3D Scene Viewer
 * Renders an interactive 3D scene from Spline.
 * 
 * Original scene: https://prod.spline.design/sQKe4kxs7WH0GmOr/scene.splinecode
 * Built with Spline (https://spline.design)
 */

import { Suspense, lazy } from 'react';

const Spline = lazy(() => import('@splinetool/react-spline'));

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
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-black text-white/50 text-sm">Loading 3D scene…</div>}>
        <Spline scene={scene} />
      </Suspense>
    </div>
  );
};

export default SplineScene;

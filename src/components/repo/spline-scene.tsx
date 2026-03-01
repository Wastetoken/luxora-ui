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
    <div className={className ?? "w-full h-screen bg-black relative"}>
      <Suspense fallback={<div className="w-full h-full flex items-center justify-center bg-black text-white/50 text-sm">Loading 3D scene…</div>}>
        <Spline scene={scene} style={{ width: '100%', height: '100%' }} />
      </Suspense>
      {/* Gradient overlay to hide Spline watermark */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/90 to-transparent z-50" />
    </div>
  );
};

export default SplineScene;

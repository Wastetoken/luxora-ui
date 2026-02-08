import { useEffect, useRef } from "react";

interface ReptileCursorProps {
  /** Size multiplier for the creature */
  size?: number;
  /** Number of leg pairs */
  legs?: number;
  /** Number of tail segments */
  tail?: number;
  /** Custom className */
  className?: string;
  /** Content to render on top */
  children?: React.ReactNode;
}

const ReptileCursor = ({
  size = 3,
  legs = 5,
  tail = 45,
  className,
  children,
}: ReptileCursorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d")!;
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    ctx.strokeStyle = "white";
    ctx.fillStyle = "red";
    ctx.lineWidth = 1.5;

    let lastMouseX: number | null = null;
    let lastMouseY: number | null = null;
    let mouseStillTime = 0;
    const mouseStillThreshold = 5000;

    const inputMouse = { x: canvas.width / 2, y: canvas.height / 2 };

    // --- Segment ---
    class Segment {
      isSegment = true;
      parent: any;
      children: Segment[] = [];
      size: number;
      relAngle: number;
      defAngle: number;
      absAngle: number;
      range: number;
      stiffness: number;
      x = 0;
      y = 0;

      constructor(parent: any, sz: number, angle: number, range: number, stiffness: number) {
        this.parent = parent;
        if (typeof parent.children === "object") parent.children.push(this);
        this.size = sz;
        this.relAngle = angle;
        this.defAngle = angle;
        this.absAngle = parent.absAngle + angle;
        this.range = range;
        this.stiffness = stiffness;
        this.updateRelative(false, true);
      }

      updateRelative(iter: boolean, flex: boolean) {
        this.relAngle = this.relAngle - 2 * Math.PI * Math.floor((this.relAngle - this.defAngle) / 2 / Math.PI + 0.5);
        if (flex) {
          this.relAngle = Math.min(this.defAngle + this.range / 2,
            Math.max(this.defAngle - this.range / 2,
              (this.relAngle - this.defAngle) / this.stiffness + this.defAngle));
        }
        this.absAngle = this.parent.absAngle + this.relAngle;
        this.x = this.parent.x + Math.cos(this.absAngle) * this.size;
        this.y = this.parent.y + Math.sin(this.absAngle) * this.size;
        if (iter)
          for (let i = 0; i < this.children.length; i++)
            this.children[i].updateRelative(iter, flex);
      }

      draw(iter: boolean) {
        ctx.beginPath();
        ctx.moveTo(this.parent.x, this.parent.y);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        if (iter)
          for (let i = 0; i < this.children.length; i++)
            this.children[i].draw(true);
      }

      follow(iter: boolean) {
        const x = this.parent.x;
        const y = this.parent.y;
        const dist = Math.sqrt((this.x - x) ** 2 + (this.y - y) ** 2);
        if (dist > 0.0001) {
          this.x = x + this.size * (this.x - x) / dist;
          this.y = y + this.size * (this.y - y) / dist;
        }
        this.absAngle = Math.atan2(this.y - y, this.x - x);
        this.relAngle = this.absAngle - this.parent.absAngle;
        this.updateRelative(false, true);
        if (iter)
          for (let i = 0; i < this.children.length; i++)
            this.children[i].follow(true);
      }
    }

    // --- LimbSystem ---
    class LimbSystem {
      end: Segment;
      length: number;
      creature: Creature;
      speed: number;
      nodes: Segment[];
      hip: any;
      step = 0;

      constructor(end: Segment, length: number, speed: number, creature: Creature) {
        this.end = end;
        this.length = Math.max(1, length);
        this.creature = creature;
        this.speed = speed;
        creature.systems.push(this);
        this.nodes = [];
        let node: any = end;
        for (let i = 0; i < length; i++) {
          this.nodes.unshift(node);
          node = node.parent;
          if (!node || !node.isSegment) {
            this.length = i + 1;
            break;
          }
        }
        this.hip = this.nodes[0].parent;
      }

      moveTo(x: number, y: number) {
        this.nodes[0].updateRelative(true, true);
        let tx = x, ty = y;
        let len = Math.max(0, Math.sqrt((tx - this.end.x) ** 2 + (ty - this.end.y) ** 2) - this.speed);
        for (let i = this.nodes.length - 1; i >= 0; i--) {
          const node = this.nodes[i];
          const ang = Math.atan2(node.y - ty, node.x - tx);
          node.x = tx + len * Math.cos(ang);
          node.y = ty + len * Math.sin(ang);
          tx = node.x;
          ty = node.y;
          len = node.size;
        }
        for (let i = 0; i < this.nodes.length; i++) {
          const node = this.nodes[i];
          node.absAngle = Math.atan2(node.y - node.parent.y, node.x - node.parent.x);
          node.relAngle = node.absAngle - node.parent.absAngle;
          for (let ii = 0; ii < node.children.length; ii++) {
            const childNode = node.children[ii];
            if (!this.nodes.includes(childNode)) {
              childNode.updateRelative(true, false);
            }
          }
        }
      }

      update(_x: number, _y: number) {
        this.moveTo(_x, _y);
      }
    }

    // --- LegSystem ---
    class LegSystem extends LimbSystem {
      goalX: number;
      goalY: number;
      forwardness = 0;
      reach: number;
      swing: number;
      swingOffset: number;

      constructor(end: Segment, length: number, speed: number, creature: Creature) {
        super(end, length, speed, creature);
        this.goalX = end.x;
        this.goalY = end.y;
        this.reach = 0.9 * Math.sqrt((this.end.x - this.hip.x) ** 2 + (this.end.y - this.hip.y) ** 2);
        let relAngle = this.creature.absAngle - Math.atan2(this.end.y - this.hip.y, this.end.x - this.hip.x);
        relAngle -= 2 * Math.PI * Math.floor(relAngle / 2 / Math.PI + 0.5);
        this.swing = -relAngle + (2 * (relAngle < 0 ? 1 : 0) - 1) * Math.PI / 2;
        this.swingOffset = this.creature.absAngle - this.hip.absAngle;
      }

      update(_x: number, _y: number) {
        this.moveTo(this.goalX, this.goalY);
        if (this.step === 0) {
          const dist = Math.sqrt((this.end.x - this.goalX) ** 2 + (this.end.y - this.goalY) ** 2);
          if (dist > 1) {
            this.step = 1;
            this.goalX = this.hip.x + this.reach * Math.cos(this.swing + this.hip.absAngle + this.swingOffset) + (2 * Math.random() - 1) * this.reach / 2;
            this.goalY = this.hip.y + this.reach * Math.sin(this.swing + this.hip.absAngle + this.swingOffset) + (2 * Math.random() - 1) * this.reach / 2;
          }
        } else if (this.step === 1) {
          const theta = Math.atan2(this.end.y - this.hip.y, this.end.x - this.hip.x) - this.hip.absAngle;
          const dist = Math.sqrt((this.end.x - this.hip.x) ** 2 + (this.end.y - this.hip.y) ** 2);
          const forwardness2 = dist * Math.cos(theta);
          const dF = this.forwardness - forwardness2;
          this.forwardness = forwardness2;
          if (dF * dF < 1) {
            this.step = 0;
            this.goalX = this.hip.x + (this.end.x - this.hip.x);
            this.goalY = this.hip.y + (this.end.y - this.hip.y);
          }
        }
      }
    }

    // --- Creature ---
    class Creature {
      x: number;
      y: number;
      absAngle: number;
      fSpeed = 0;
      fAccel: number;
      fFric: number;
      fRes: number;
      fThresh: number;
      rSpeed = 0;
      rAccel: number;
      rFric: number;
      rRes: number;
      rThresh: number;
      children: Segment[] = [];
      systems: (LimbSystem | LegSystem)[] = [];
      speed = 0;
      randomTarget: { x: number; y: number } | null = null;
      randomTargetReachedThreshold = 15;

      constructor(x: number, y: number, angle: number, fAccel: number, fFric: number, fRes: number, fThresh: number, rAccel: number, rFric: number, rRes: number, rThresh: number) {
        this.x = x;
        this.y = y;
        this.absAngle = angle;
        this.fAccel = fAccel;
        this.fFric = fFric;
        this.fRes = fRes;
        this.fThresh = fThresh;
        this.rAccel = rAccel;
        this.rFric = rFric;
        this.rRes = rRes;
        this.rThresh = rThresh;
      }

      follow(x: number, y: number) {
        let tx = x, ty = y;
        if (mouseStillTime > mouseStillThreshold) {
          if (!this.randomTarget ||
            (Math.hypot(this.x - this.randomTarget.x, this.y - this.randomTarget.y) < this.randomTargetReachedThreshold)) {
            this.randomTarget = {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height
            };
          }
          tx = this.randomTarget.x;
          ty = this.randomTarget.y;
        } else {
          this.randomTarget = null;
        }

        const dist = Math.sqrt((this.x - tx) ** 2 + (this.y - ty) ** 2);
        const angle = Math.atan2(ty - this.y, tx - this.x);
        let accel = this.fAccel;
        if (this.systems.length > 0) {
          let sum = 0;
          for (let i = 0; i < this.systems.length; i++) {
            sum += (this.systems[i].step === 0 ? 1 : 0);
          }
          accel *= sum / this.systems.length;
        }
        this.fSpeed += accel * (dist > this.fThresh ? 1 : 0);
        this.fSpeed *= 1 - this.fRes;
        this.speed = Math.max(0, this.fSpeed - this.fFric);
        let dif = this.absAngle - angle;
        dif -= 2 * Math.PI * Math.floor(dif / (2 * Math.PI) + 0.5);
        if (Math.abs(dif) > this.rThresh && dist > this.fThresh) {
          this.rSpeed -= this.rAccel * (2 * (dif > 0 ? 1 : 0) - 1);
        }
        this.rSpeed *= 1 - this.rRes;
        if (Math.abs(this.rSpeed) > this.rFric) {
          this.rSpeed -= this.rFric * (2 * (this.rSpeed > 0 ? 1 : 0) - 1);
        } else {
          this.rSpeed = 0;
        }
        this.absAngle += this.rSpeed;
        this.absAngle -= 2 * Math.PI * Math.floor(this.absAngle / (2 * Math.PI) + 0.5);
        this.x += this.speed * Math.cos(this.absAngle);
        this.y += this.speed * Math.sin(this.absAngle);
        this.absAngle += Math.PI;
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].follow(true);
        }
        for (let i = 0; i < this.systems.length; i++) {
          this.systems[i].update(tx, ty);
        }
        this.absAngle -= Math.PI;
        this.draw(true);
      }

      draw(iter: boolean) {
        const r = 4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, r, Math.PI / 4 + this.absAngle, 7 * Math.PI / 4 + this.absAngle);
        ctx.moveTo(this.x + r * Math.cos(7 * Math.PI / 4 + this.absAngle), this.y + r * Math.sin(7 * Math.PI / 4 + this.absAngle));
        ctx.lineTo(this.x + r * Math.cos(this.absAngle) * Math.sqrt(2), this.y + r * Math.sin(this.absAngle) * Math.sqrt(2));
        ctx.lineTo(this.x + r * Math.cos(Math.PI / 4 + this.absAngle), this.y + r * Math.sin(Math.PI / 4 + this.absAngle));
        ctx.stroke();
        if (iter) {
          for (let i = 0; i < this.children.length; i++) {
            this.children[i].draw(true);
          }
        }
      }
    }

    // --- Setup lizard ---
    const s = size;
    const critter = new Creature(
      canvas.width / 2,
      canvas.height,
      0,
      s * 10, s * 2, 0.5, 16,
      0.5, 0.085, 0.5, 0.3
    );

    let spinal: any = critter;

    for (let i = 0; i < 6; i++) {
      spinal = new Segment(spinal, s * 4, 0, Math.PI * 2 / 3, 1.1);
      for (let ii = -1; ii <= 1; ii += 2) {
        let node: any = new Segment(spinal, s * 3, ii, 0.1, 2);
        for (let iii = 0; iii < 3; iii++) {
          node = new Segment(node, s * 0.1, -ii * 0.1, 0.1, 2);
        }
      }
    }

    for (let i = 0; i < legs; i++) {
      if (i > 0) {
        for (let ii = 0; ii < 6; ii++) {
          spinal = new Segment(spinal, s * 4, 0, 1.571, 1.5);
          for (let iii = -1; iii <= 1; iii += 2) {
            let node: any = new Segment(spinal, s * 3, iii * 1.571, 0.1, 1.5);
            for (let iv = 0; iv < 3; iv++) {
              node = new Segment(node, s * 3, -iii * 0.3, 0.1, 2);
            }
          }
        }
      }
      for (let ii = -1; ii <= 1; ii += 2) {
        let node: any = new Segment(spinal, s * 12, ii * 0.785, 0, 8);
        node = new Segment(node, s * 16, -ii * 0.785, 6.28, 1);
        node = new Segment(node, s * 16, ii * 1.571, Math.PI, 2);
        for (let iii = 0; iii < 4; iii++) {
          new Segment(node, s * 4, (iii / 3 - 0.5) * 1.571, 0.1, 4);
        }
        new LegSystem(node, 3, s * 12, critter);
      }
    }

    for (let i = 0; i < tail; i++) {
      spinal = new Segment(spinal, s * 4, 0, Math.PI * 2 / 3, 1.1);
      for (let ii = -1; ii <= 1; ii += 2) {
        let node: any = new Segment(spinal, s * 3, ii, 0.1, 2);
        for (let iii = 0; iii < 3; iii++) {
          node = new Segment(node, s * 3 * (tail - i) / tail, -ii * 0.1, 0.1, 2);
        }
      }
    }

    // --- Input & loop ---
    const updateMouse = (mx: number, my: number) => {
      if (lastMouseX !== null && lastMouseY !== null) {
        if (Math.abs(mx - lastMouseX) > 1 || Math.abs(my - lastMouseY) > 1) {
          mouseStillTime = 0;
        }
      }
      lastMouseX = mx;
      lastMouseY = my;
      inputMouse.x = mx;
      inputMouse.y = my;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      updateMouse(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const t = e.touches[0];
      updateMouse(t.clientX - rect.left, t.clientY - rect.top);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const t = e.touches[0];
      updateMouse(t.clientX - rect.left, t.clientY - rect.top);
    };

    const handleResize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      ctx.strokeStyle = "white";
      ctx.fillStyle = "red";
      ctx.lineWidth = 1.5;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("resize", handleResize);

    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw small circular cursor at exact mouse position
      ctx.beginPath();
      ctx.arc(inputMouse.x, inputMouse.y, 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Reset styles for creature drawing
      ctx.strokeStyle = "white";
      ctx.lineWidth = 1.5;

      if (lastMouseX !== null && lastMouseY !== null) {
        if (Math.abs(inputMouse.x - lastMouseX) < 1 && Math.abs(inputMouse.y - lastMouseY) < 1) {
          mouseStillTime += 33;
        } else {
          mouseStillTime = 0;
        }
        lastMouseX = inputMouse.x;
        lastMouseY = inputMouse.y;
      }

      critter.follow(inputMouse.x, inputMouse.y);
    }, 33);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("resize", handleResize);
      clearInterval(interval);
    };
  }, [size, legs, tail]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full cursor-none overflow-hidden ${className ?? ""}`}
      style={{ background: "black", touchAction: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: "black" }}
      />
      {children}
    </div>
  );
};

export { ReptileCursor };

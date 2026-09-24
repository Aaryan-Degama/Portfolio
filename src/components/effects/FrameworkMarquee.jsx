import { useEffect, useRef } from "react";
import gsap from "gsap";
import { NEON } from "../../theme/palette";

export default function FrameworkMarquee() {
  return (
    <div className="w-full overflow-hidden">
      <MarqueeRow reverse={false} />
      <MarqueeRow reverse={true} />
    </div>
  );
}

/* ---------------------------------------------------- */

function MarqueeRow({ reverse }) {
  const containerRef = useRef(null);
  const groupRef = useRef(null);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;

    let pos = 0;
    const speed = reverse ? 0.5 : -0.5;

    // because we duplicated content
    const distance = group.scrollWidth / 2;

    // wrap position between -distance and 0
    const wrap = gsap.utils.wrap(-distance, 0);

    gsap.set(group, { x: 0 });

    const tick = () => {
      pos += speed;
      pos = wrap(pos);          // 🔑 this is the fix
      gsap.set(group, { x: pos });
    };

    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
    };
  }, [reverse]);

  return (
    <div
      ref={containerRef}
      className="relative w-full py-2 overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div
        ref={groupRef}
        className="flex gap-4 will-change-transform"
      >
        <TileSet />
        <TileSet />
      </div>
    </div>
  );
}

/* ---------------------------------------------------- */

const icons = [
  "devicon-cplusplus-plain",
  "devicon-c-plain",
  "devicon-python-plain",
  "devicon-rust-original",
  "devicon-javascript-plain",
  "devicon-typescript-plain",
  "devicon-pytorch-original",
  "devicon-opencv-plain",
  "devicon-cmake-plain",
  "devicon-android-plain",
  "devicon-linux-plain",
  "devicon-fedora-plain",
  "devicon-git-plain",
  "devicon-github-original",
  "devicon-docker-plain",
  "devicon-sqlite-plain",
  "devicon-mongodb-plain",
  "devicon-mysql-original",
  "devicon-nodejs-plain",
  "devicon-express-original-wordmark",
  "devicon-fastapi-plain",
  "devicon-react-original",
  "devicon-amazonwebservices-plain-wordmark",
];

// Dark tiles in the same shape as the home page's project cards, each icon
// lit by one of the hero's tube neons in turn.
const TUBE = [NEON.magenta, NEON.lime, NEON.cyan, NEON.ember];

function TileSet() {
  return (
    <>
      {icons.map((icon, i) => {
        const neon = TUBE[i % TUBE.length];
        return (
          <div
            key={`${icon}-${i}`}
            className="flex items-center justify-center flex-shrink-0 w-56 h-32 rounded-[18px] bg-void"
          >
            <i
              className={`${icon} text-6xl`}
              style={{ color: neon, filter: `drop-shadow(0 0 10px ${neon}90)` }}
              aria-hidden
            />
          </div>
        );
      })}
    </>
  );
}

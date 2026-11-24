export function SvgFilters() {
  return (
    <svg className="pointer-events-none fixed inset-0 h-0 w-0" aria-hidden="true">
      <defs>
        {/* Paper Grain: feTurbulence at ~6% opacity */}
        <filter id="paper-grain" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="4"
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 0.06 0"
          />
        </filter>

        {/* Rubber Stamp Rough Ink Filter: feTurbulence + feDisplacementMap */}
        <filter id="stamp-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.05"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="3"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

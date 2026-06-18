import svgPaths from "./svg-8t40qc223t";

interface GroupProps {
  scrolled?: boolean;
}

export default function Group({ scrolled = false }: GroupProps) {
  const textColor = scrolled ? "#7B2D42" : "white";
  
  return (
    <div className="relative size-full">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1378.66 461.842">
        <g clipPath="url(#clip0_48_568)" id="Group 1410124151">
          <path d={svgPaths.p3f693e00} fill={textColor} id="Vector" />
          <g id="Group 1410124150">
            <path d={svgPaths.p37228200} fill="#7B2D42" id="Vector_2" />
            <path d={svgPaths.p39ad80} fill={textColor} id="Vector_3" />
            <path d={svgPaths.p2a301100} fill={textColor} id="Vector_4" />
            <path d={svgPaths.p2ca1ef00} fill={textColor} id="Vector_5" />
            <path d={svgPaths.p10ce14c0} fill={textColor} id="Vector_6" />
            <path d={svgPaths.p24795880} fill={textColor} id="Vector_7" />
            <path d={svgPaths.pcc5f700} fill={textColor} id="Vector_8" />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_48_568">
            <rect fill="white" height="461.842" width="1378.66" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
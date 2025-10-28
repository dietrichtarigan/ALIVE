const ArcadeLogo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width={28}
    height={28}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect x={2} y={2} width={28} height={28} rx={9} fill="currentColor" opacity={0.12} />
    <path
      d="M24 22c-2.5-3.8-4.8-5.7-8-5.7s-5.5 2-8 5.7"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="M20.5 16c-1.4-2.6-2.8-3.9-4.5-3.9S12.9 13.4 11.5 16"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <circle cx={16} cy={11} r={2} fill="currentColor" />
  </svg>
);

export default ArcadeLogo;

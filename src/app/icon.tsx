import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '512px',
          height: '512px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#00b5d5',
          borderRadius: '50%',
        }}
      >
        <svg
          width="320"
          height="300"
          viewBox="0 0 320 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Roof left slant */}
          <polygon points="160,20 20,130 80,130" fill="white" />
          {/* Roof right slant */}
          <polygon points="160,20 300,130 240,130" fill="white" />
          {/* Roof center triangle filled */}
          <polygon points="160,20 80,130 240,130" fill="white" />
          {/* Gap inside roof (blue cutout) */}
          <polygon points="160,45 95,130 225,130" fill="#00b5d5" />

          {/* AF text inside roof */}
          <text
            x="160"
            y="118"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="900"
            fontSize="52"
            fill="white"
            letterSpacing="-2"
          >
            AF
          </text>

          {/* Top bar of building */}
          <rect x="30" y="130" width="260" height="18" fill="white" />

          {/* Left pillar */}
          <rect x="30" y="148" width="70" height="100" fill="white" />
          {/* Left pillar gap */}
          <rect x="42" y="185" width="46" height="63" fill="#00b5d5" />

          {/* Right pillar */}
          <rect x="220" y="148" width="70" height="100" fill="white" />
          {/* Right pillar gap */}
          <rect x="232" y="185" width="46" height="63" fill="#00b5d5" />

          {/* Center section */}
          <rect x="100" y="148" width="120" height="100" fill="white" />
          {/* Center gap */}
          <rect x="112" y="185" width="96" height="63" fill="#00b5d5" />

          {/* HOTEL text */}
          <text
            x="160"
            y="178"
            textAnchor="middle"
            fontFamily="Arial, sans-serif"
            fontWeight="700"
            fontSize="24"
            fill="#00b5d5"
          >
            HOTEL
          </text>

          {/* Bottom bar */}
          <rect x="30" y="248" width="260" height="16" fill="white" />
        </svg>
      </div>
    ),
    { ...size }
  );
}

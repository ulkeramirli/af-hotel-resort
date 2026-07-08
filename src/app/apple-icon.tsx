import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default async function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          borderRadius: '20%',
        }}
      >
        <img src="https://af-hotel.az/loqo-af.png" height={120} style={{ objectFit: 'contain' }} alt="AF Logo" />
      </div>
    ),
    { ...size }
  );
}

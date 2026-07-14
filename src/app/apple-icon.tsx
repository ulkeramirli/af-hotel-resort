import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 512, height: 512 };
export const contentType = 'image/png';

export default async function Icon() {
  // Fetch the official Facebook profile picture
  const res = await fetch('https://graph.facebook.com/AFHotelAquaPark/picture?type=large');
  const arrayBuffer = await res.arrayBuffer();
  
  // Convert array buffer to base64 so we can use it in the img tag
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const imgSrc = `data:image/jpeg;base64,${base64}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <img
          src={imgSrc}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      </div>
    ),
    { ...size }
  );
}

import { Metadata } from 'next';
import { connectDB } from '@/lib/db';
import Room from '@/models/Room';
import RoomDetailPageClient from './RoomDetailPageClient';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    await connectDB();
    const room = await Room.findById(id).lean() as any;

    if (!room) {
      return {
        title: 'Otaq Tapılmadı | AF Hotel',
      };
    }

    const titleAz = room.name?.az || 'Otaq';
    const descAz = room.description?.az?.replace(/<[^>]*>?/gm, '').substring(0, 160) || 'AF Hotel-də lüks otaq.';
    const image = room.images?.[0] || 'https://afhotel.az/rooms.jpg';

    return {
      title: `${titleAz} | AF Hotel & Aqua Park`,
      description: descAz,
      openGraph: {
        title: `${titleAz} | AF Hotel`,
        description: descAz,
        url: `https://afhotel.az/rooms/${id}`,
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: titleAz,
          },
        ],
        locale: 'az_AZ',
        type: 'website',
      },
      alternates: {
        canonical: `https://afhotel.az/rooms/${id}`,
        languages: {
          'az-AZ': `https://afhotel.az/rooms/${id}`,
          'en-US': `https://afhotel.az/rooms/${id}?lang=en`,
          'ru-RU': `https://afhotel.az/rooms/${id}?lang=ru`,
        }
      }
    };
  } catch (err) {
    return {
      title: 'Otaq | AF Hotel',
    };
  }
}

export default function RoomDetailPage(props: Props) {
  return <RoomDetailPageClient params={props.params} />;
}

import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ECLECTIC HIVE — Luxury Event Design & Production'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
        }}
      >
        <div
          style={{
            fontFamily: 'serif',
            fontSize: 72,
            fontWeight: 400,
            color: '#f5f2ed',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
          }}
        >
          ECLECTIC HIVE
        </div>
        <div
          style={{
            fontFamily: 'sans-serif',
            fontSize: 20,
            color: 'rgba(245,242,237,0.5)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Luxury Event Design & Production
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            right: 48,
            fontFamily: 'sans-serif',
            fontSize: 14,
            color: 'rgba(245,242,237,0.3)',
            letterSpacing: '0.15em',
          }}
        >
          eclectichive.com
        </div>
      </div>
    ),
    { ...size }
  )
}

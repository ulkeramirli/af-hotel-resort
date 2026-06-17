'use client';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ApiDocs() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if swagger ui style is already present, if not load it
    let swaggerCss = document.getElementById('swagger-ui-css') as HTMLLinkElement | null;
    if (!swaggerCss) {
      swaggerCss = document.createElement('link');
      swaggerCss.id = 'swagger-ui-css';
      swaggerCss.rel = 'stylesheet';
      swaggerCss.href = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css';
      document.head.appendChild(swaggerCss);
    }

    // Load Swagger UI bundle script
    let swaggerScript = document.getElementById('swagger-ui-js') as HTMLScriptElement | null;
    if (!swaggerScript) {
      swaggerScript = document.createElement('script');
      swaggerScript.id = 'swagger-ui-js';
      swaggerScript.src = 'https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js';
      swaggerScript.async = true;
      document.body.appendChild(swaggerScript);
    }

    const initSwagger = () => {
      // @ts-ignore
      if (window.SwaggerUIBundle) {
        setLoading(false);
        try {
          // @ts-ignore
          window.SwaggerUIBundle({
            url: '/api/swagger.json',
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              // @ts-ignore
              window.SwaggerUIBundle.presets.apis,
              // @ts-ignore
              window.SwaggerUIBundle.SwaggerUIStandalonePreset
            ],
            layout: "BaseLayout",
          });
        } catch (err: any) {
          setError(err.message || 'Swagger UI initialization failed');
        }
      } else {
        // Retry in 100ms if not loaded yet
        setTimeout(initSwagger, 100);
      }
    };

    if (typeof window !== 'undefined' && (window as any).SwaggerUIBundle) {
      initSwagger();
    } else {
      swaggerScript.addEventListener('load', initSwagger);
      swaggerScript.addEventListener('error', () => {
        setError('Failed to load Swagger UI scripts');
        setLoading(false);
      });
    }

    return () => {
      // We don't remove stylesheets/scripts to preserve caching if user navigates back and forth
    };
  }, []);

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', paddingBottom: '40px' }}>
      {/* Premium Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: '#ffffff',
        padding: '24px 40px',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 700, letterSpacing: '-0.025em' }}>
            AF Aqua Hotel & Resort
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>
            Interaktiv API Sənədləşdirilməsi və Sınaq Portalı (Swagger UI)
          </p>
        </div>
        <div>
          <Link
            href="/"
            style={{
              color: '#38bdf8',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #334155',
              transition: 'all 0.2s',
              backgroundColor: '#1e293b'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#334155';
              e.currentTarget.style.color = '#f8fafc';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#1e293b';
              e.currentTarget.style.color = '#38bdf8';
            }}
          >
            Ana Səhifəyə Qayıt
          </Link>
        </div>
      </div>

      {loading && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '16px'
          }} />
          <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
            Swagger interfeysi yüklənir, zəhmət olmasa gözləyin...
          </p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {error && (
        <div style={{
          maxWidth: '600px',
          margin: '40px auto',
          padding: '24px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fee2e2',
          borderRadius: '8px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#991b1b', fontSize: '18px' }}>Xəta Baş Verdi</h3>
          <p style={{ margin: 0, color: '#b91c1c', fontSize: '14px' }}>{error}</p>
        </div>
      )}

      <div style={{ display: loading || error ? 'none' : 'block' }}>
        <div id="swagger-ui" />
      </div>
    </div>
  );
}

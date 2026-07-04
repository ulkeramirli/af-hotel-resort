export function bookingConfirmedEmail(
  name: string,
  roomName: string,
  checkIn: string,
  checkOut: string,
) {
  return {
    subject: "AF-HOTEL | Rezervasiyanız təsdiqləndi",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 40px 0; margin: 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #10b981, #047857); padding: 40px 20px;">
              <div style="background-color: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; display: inline-block; margin-bottom: 15px; line-height: 60px; font-size: 30px;">✅</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">AF HOTEL & RESORT</h1>
              <p style="color: #d1fae5; margin: 10px 0 0; font-size: 14px; font-weight: 300; letter-spacing: 1px;">REZERVASIYA TƏSDİQLƏNDİ</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1e325c; font-size: 22px; margin-top: 0; margin-bottom: 20px;">Hörmətli ${name},</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Şad xəbər! Sizin rezervasiyanız uğurla <b>təsdiqləndi</b> və otağınız sizin üçün ayrıldı. Sizi AF-HOTEL-də qarşılamaqdan böyük məmnuniyyət duyarıq.
              </p>
              
              <div style="background-color: #f8fafc; border-left: 4px solid #10b981; padding: 25px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                <h3 style="color: #1e325c; margin-top: 0; margin-bottom: 20px; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Rezervasiya Detalları</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;" width="35%">Otaq:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600; font-size: 15px;">${roomName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Giriş Tarixi:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600; font-size: 15px;">${checkIn}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Çıxış Tarixi:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600; font-size: 15px;">${checkOut}</td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">
                Otelə yaxınlaşarkən qeydiyyat şöbəsinə (Reception) ad və soyadınızı və ya bu e-poçt mesajını təqdim etməyiniz kifayətdir. Xoş istirahətlər arzu edirik!
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                © ${new Date().getFullYear()} AF Hotel & Aqua Park Resort. Bütün hüquqlar qorunur.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };
}

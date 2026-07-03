export function adminBookingNotification(
  name: string,
  email: string,
  phone: string,
  roomName: string,
  checkIn: string,
  checkOut: string,
) {
  return {
    subject: "AF-HOTEL | Yeni rezervasiya sorğusu",
    html: `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; padding: 40px 0; margin: 0;">
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
          <tr>
            <td align="center" style="background: linear-gradient(135deg, #4f46e5, #312e81); padding: 40px 20px;">
              <div style="background-color: rgba(255,255,255,0.2); width: 60px; height: 60px; border-radius: 50%; display: inline-block; margin-bottom: 15px; line-height: 60px; font-size: 30px;">🔔</div>
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 2px;">AF HOTEL & RESORT</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0; font-size: 14px; font-weight: 300; letter-spacing: 1px;">YENİ REZERVASİYA BİLDİRİŞİ</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1e325c; font-size: 22px; margin-top: 0; margin-bottom: 20px;">Yeni rezervasiya daxil oldu!</h2>
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                Sistemə yeni bir rezervasiya sorğusu daxil olmuşdur. Aşağıdakı məlumatları nəzərdən keçirib admin paneldən təsdiqləyə bilərsiniz.
              </p>
              
              <div style="background-color: #f8fafc; border-left: 4px solid #4f46e5; padding: 25px; border-radius: 0 8px 8px 0; margin-bottom: 30px;">
                <h3 style="color: #1e325c; margin-top: 0; margin-bottom: 20px; font-size: 18px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Qonaq Məlumatları</h3>
                
                <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;" width="35%">Müştəri Adı:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600; font-size: 15px;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">E-poçt:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600; font-size: 15px;">
                      <a href="mailto:${email}" style="color: #4f46e5; text-decoration: none;">${email}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Telefon:</td>
                    <td style="padding: 8px 0; color: #0f172a; font-weight: 600; font-size: 15px;">
                      <a href="tel:${phone}" style="color: #4f46e5; text-decoration: none;">${phone}</a>
                    </td>
                  </tr>
                </table>

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
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="https://af-hotel-resort.vercel.app/admin/bronlar" style="background-color: #4f46e5; color: #ffffff; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: bold; display: inline-block;">Admin Panelə Keç</a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0;">
                Sistem tərəfindən avtomatik generasiya olunmuşdur.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `,
  };
}

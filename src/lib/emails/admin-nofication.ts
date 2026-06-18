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
      <div style="font-family:Arial,sans-serif;color:#333">

        <div style="
          background:#1f2937;
          padding:20px;
          text-align:center;
        ">
          <h1 style="color:white">
            AF-HOTEL
          </h1>

          <p style="color:white">
            Yeni rezervasiya bildirişi
          </p>
        </div>


        <div style="padding:25px">

          <h2>
            Yeni rezervasiya daxil oldu
          </h2>


          <p>
            👤 Müştəri: ${name}
          </p>

          <p>
            📧 Email: ${email}
          </p>

          <p>
            📞 Telefon: ${phone}
          </p>


          <hr/>


          <h3>
            Rezervasiya məlumatları
          </h3>


          <p>
            🛏️ Otaq: ${roomName}
          </p>

          <p>
            📅 Giriş: ${checkIn}
          </p>

          <p>
            📅 Çıxış: ${checkOut}
          </p>


        </div>

      </div>
    `,
  };
}

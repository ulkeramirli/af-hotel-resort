export function bookingConfirmedEmail(
  name: string,
  roomName: string,
  checkIn: string,
  checkOut: string,
) {
  return {
    subject: "AF-HOTEL | Rezervasiyanız təsdiqləndi",

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
        </div>


        <div style="padding:25px">

          <h2>
            Hörmətli ${name},
          </h2>

          <p>
            Sizin rezervasiyanız uğurla təsdiqləndi.
          </p>

          <p>
            Sizi AF-HOTEL-də qarşılamaqdan məmnun olarıq.
          </p>


          <hr/>


          <h3>
            Rezervasiya məlumatları
          </h3>


          <p>
            🛏️ Otaq: ${roomName}
          </p>

          <p>
            📅 Giriş:
            ${checkIn}
          </p>

          <p>
            📅 Çıxış:
            ${checkOut}
          </p>


          <br/>


          <p>
            Hörmətlə,<br/>
            <b>AF-HOTEL komandası</b>
          </p>

        </div>

      </div>
    `,
  };
}

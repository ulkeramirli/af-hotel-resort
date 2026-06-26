export function bookingCancelledEmail(
  name: string,
  roomName: string,
  checkIn: string,
  checkOut: string,
) {
  return {
    subject: "AF-HOTEL | Rezervasiya ləğv edildi",

    html: `

      <div style="
        font-family:Arial,sans-serif;
        color:#333;
      ">


        <div style="
          background:#991b1b;
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
            Təəssüf ki, sizin rezervasiya sorğunuz ləğv edildi.
          </p>


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



          <p>
            Əlavə məlumat üçün bizimlə əlaqə saxlaya bilərsiniz.
          </p>


          <br/>


          <b>
            AF-HOTEL komandası
          </b>


        </div>

      </div>

    `,
  };
}

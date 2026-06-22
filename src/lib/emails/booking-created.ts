export function bookingCreatedEmail(
  name: string,
  roomName: string,
  checkIn: string,
  checkOut: string,
) {
  return {
    subject: "AF-HOTEL | Rezervasiya sorğunuz qəbul edildi",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        color:#333;
      ">

        <div style="
          background:#1f2937;
          padding:20px;
          text-align:center;
        ">

          <h1 style="color:white;">
            AF-HOTEL
          </h1>

          <p style="color:white;">
            Rezervasiya xidməti
          </p>

        </div>


        <div style="padding:25px;">

          <h2>
            Hörmətli ${name},
          </h2>


          <p>
            AF-HOTEL-i seçdiyiniz üçün təşəkkür edirik.
          </p>


          <p>
            Sizin rezervasiya sorğunuz uğurla qəbul edildi.
            Məlumatlarınız yoxlanıldıqdan sonra sizinlə
            əlaqə saxlanılacaq.
          </p>



          <div style="
            background:#f3f4f6;
            padding:15px;
            border-radius:8px;
          ">

            <h3>
              Rezervasiya məlumatları
            </h3>


            <p>
              🏨 Otel: AF-HOTEL
            </p>


            <p>
              🛏️ Otaq: ${roomName}
            </p>


            <p>
              📅 Giriş tarixi: ${checkIn}
            </p>


            <p>
              📅 Çıxış tarixi: ${checkOut}
            </p>


          </div>



          <p>
            Sizi AF-HOTEL-də qarşılamaqdan məmnun olarıq.
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

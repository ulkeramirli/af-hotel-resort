export function forgotPasswordTemplate(
  name: string,
  otp: string,
) {
  return {
    subject: "AF HOTEL - Password Reset Request",

    html: `
    <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden;">

      <div style="background:#1f2937; padding:20px; text-align:center;">
        <h1 style="color:white; margin:0;">
          AF HOTEL
        </h1>
        <p style="color:#d1d5db; margin-top:8px;">
          Şifrə Bərpası
        </p>
      </div>

      <div style="padding:30px;">

        <h2 style="color:#111827;">
          Salam, ${name} 👋
        </h2>

        <p style="color:#4b5563;">
          Hesabınız üçün şifrə sıfırlama sorğusu qəbul edilmişdir.
        </p>

        <p style="color:#4b5563;">
          Əgər bu sorğunu siz göndərmisinizsə,
          aşağıdakı koddan istifadə edərək yeni şifrə təyin edin:
        </p>

        <div style="text-align:center; margin:30px 0;">
          <div style="
            display:inline-block;
            background:#f3f4f6;
            padding:18px 35px;
            border-radius:10px;
            font-size:32px;
            font-weight:bold;
            letter-spacing:6px;
            color:#111827;
          ">
            ${otp}
          </div>
        </div>

        <p style="color:#4b5563;">
          Bu kod <b>10 dəqiqə</b> ərzində etibarlıdır.
        </p>

        <p style="color:#ef4444;">
          Əgər bu sorğunu siz göndərməmisinizsə,
          hesabınızın təhlükəsizliyi üçün bu emaili nəzərə alın.
        </p>

        <br/>

        <p style="color:#111827;">
          Hörmətlə,<br/>
          <b>AF HOTEL Komandası</b>
        </p>

      </div>

    </div>
    `,
  };
}
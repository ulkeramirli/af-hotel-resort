export function verifyEmailTemplate(name: string, otp: string) {
  return {
    subject: "AF HOTEL - Email Verification",

    html: `
      <h2 style="color:#111827;"> Salam, ${name} 👋 </h2> <p style="color:#4b5563;"> AF HOTEL ailəsinə xoş gəlmisiniz. Hesabınızı aktivləşdirmək üçün aşağıdakı təsdiqləmə kodundan istifadə edin: </p> <div style="text-align:center; margin:30px 0;"> <div style=" display:inline-block; background:#f3f4f6; padding:18px 35px; border-radius:10px; font-size:32px; font-weight:bold; letter-spacing:6px; color:#111827; "> ${otp} </div> </div> <p style="color:#4b5563;"> Bu kod <b>10 dəqiqə</b> ərzində etibarlıdır. </p> <p style="color:#4b5563;"> Əgər bu əməliyyatı siz etməmisinizsə, bu emaili nəzərə almayın. </p> <br/> <p style="color:#111827;"> Hörmətlə,<br/> <b>AF HOTEL Komandası</b> </p>
    `,
  };
}

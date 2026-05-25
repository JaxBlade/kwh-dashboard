import nodemailer from 'nodemailer';

// Menyimpan transporter global agar tidak selalu membuat akun baru saat dev
let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.NODE_ENV === 'production') {
    // Pada production, gunakan SMTP dari environment variable
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true', 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Pada development, gunakan Ethereal Email secara otomatis
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("Ethereal Email account created for development.");
  }
  return transporter;
}

export async function sendActivationEmail(to: string, token: string) {
  const t = await getTransporter();
  
  const activateUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/activate?token=${token}`;
  
  const info = await t.sendMail({
    from: '"Smart Power BMS" <noreply@bms.com>',
    to,
    subject: "Aktivasi Akun Tenant Anda",
    html: `
      <h2>Selamat Datang di Smart Power!</h2>
      <p>Admin telah mendaftarkan Anda sebagai Tenant.</p>
      <p>Silakan klik tombol di bawah ini untuk mengaktifkan akun Anda dan mengatur kata sandi Anda:</p>
      <a href="${activateUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: #fff; text-decoration: none; border-radius: 5px;">Aktifkan Akun</a>
      <p>Atau copy link berikut ke browser Anda: <br/> ${activateUrl}</p>
    `,
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log("Preview URL (Aktivasi): %s", nodemailer.getTestMessageUrl(info));
  }
  return info;
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const t = await getTransporter();
  
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const info = await t.sendMail({
    from: '"Smart Power BMS" <noreply@bms.com>',
    to,
    subject: "Reset Kata Sandi Akun Anda",
    html: `
      <h2>Permintaan Reset Kata Sandi</h2>
      <p>Kami menerima permintaan reset kata sandi untuk akun Anda.</p>
      <p>Silakan klik tombol di bawah ini untuk mereset kata sandi Anda:</p>
      <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: #fff; text-decoration: none; border-radius: 5px;">Reset Kata Sandi</a>
      <p>Tautan ini hanya berlaku selama 1 jam.</p>
      <p>Atau copy link berikut ke browser Anda: <br/> ${resetUrl}</p>
      <p>Jika Anda tidak meminta ini, abaikan email ini.</p>
    `,
  });

  if (process.env.NODE_ENV !== 'production') {
    console.log("Preview URL (Reset Password): %s", nodemailer.getTestMessageUrl(info));
  }
  return info;
}

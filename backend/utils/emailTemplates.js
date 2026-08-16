// utils/emailTemplates.js

const verificationEmailTemplate = (name, otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify Your Email</title>
</head>

<body style="margin:0; padding:0; background-color:#0a0a0a; font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#0a0a0a; padding:40px 15px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:560px; background-color:#111111; border:1px solid #242424; border-radius:12px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center"
              style="padding:32px 30px 24px; border-bottom:1px solid #242424;">

              <div style="
                width:56px;
                height:56px;
                line-height:56px;
                background-color:#FF6B00;
                border-radius:12px;
                color:#000000;
                font-size:24px;
                font-weight:bold;
                margin-bottom:16px;
              ">
                C
              </div>

              <h1 style="
                margin:0;
                color:#ffffff;
                font-size:24px;
                line-height:32px;
              ">
                Verify Your Email
              </h1>

              <p style="
                margin:8px 0 0;
                color:#777777;
                font-size:14px;
              ">
                Complete your account verification
              </p>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 30px;">

              <p style="
                margin:0 0 16px;
                color:#ffffff;
                font-size:16px;
              ">
                Hi ${name || 'there'},
              </p>

              <p style="
                margin:0 0 24px;
                color:#aaaaaa;
                font-size:14px;
                line-height:24px;
              ">
                Thanks for registering with us. Use the verification
                code below to verify your email address.
              </p>

              <!-- OTP -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center"
                    style="
                      background-color:#0d0d0d;
                      border:1px solid #2a2a2a;
                      border-radius:8px;
                      padding:24px;
                    ">

                    <p style="
                      margin:0 0 10px;
                      color:#666666;
                      font-size:11px;
                      text-transform:uppercase;
                      letter-spacing:2px;
                    ">
                      Verification Code
                    </p>

                    <p style="
                      margin:0;
                      color:#FF6B00;
                      font-size:34px;
                      line-height:42px;
                      font-weight:bold;
                      letter-spacing:8px;
                    ">
                      ${otp}
                    </p>

                  </td>
                </tr>
              </table>

              <p style="
                margin:24px 0 0;
                color:#777777;
                font-size:13px;
                line-height:21px;
                text-align:center;
              ">
                This code will expire in <strong style="color:#aaaaaa;">10 minutes</strong>.
              </p>

              <p style="
                margin:24px 0 0;
                color:#666666;
                font-size:12px;
                line-height:20px;
              ">
                If you didn't create an account, you can safely ignore
                this email.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
              style="
                padding:20px 30px;
                border-top:1px solid #242424;
                background-color:#0d0d0d;
              ">

              <p style="
                margin:0;
                color:#555555;
                font-size:11px;
              ">
                © ${new Date().getFullYear()} Code With Bihar
              </p>

              <p style="
                margin:6px 0 0;
                color:#444444;
                font-size:10px;
              ">
                This is an automated email. Please do not reply.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};


const resetPasswordEmailTemplate = (name, resetUrl) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password</title>
</head>

<body style="margin:0; padding:0; background-color:#0a0a0a; font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0"
    style="background-color:#0a0a0a; padding:40px 15px;">
    <tr>
      <td align="center">

        <table width="100%" cellpadding="0" cellspacing="0" border="0"
          style="max-width:560px; background-color:#111111; border:1px solid #242424; border-radius:12px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center"
              style="padding:32px 30px 24px; border-bottom:1px solid #242424;">

              <div style="
                width:56px;
                height:56px;
                line-height:56px;
                background-color:#FF6B00;
                border-radius:12px;
                color:#000000;
                font-size:24px;
                font-weight:bold;
                margin-bottom:16px;
              ">
                C
              </div>

              <h1 style="
                margin:0;
                color:#ffffff;
                font-size:24px;
                line-height:32px;
              ">
                Reset Your Password
              </h1>

              <p style="
                margin:8px 0 0;
                color:#777777;
                font-size:14px;
              ">
                Secure your account with a new password
              </p>

            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:32px 30px;">

              <p style="
                margin:0 0 16px;
                color:#ffffff;
                font-size:16px;
              ">
                Hi ${name || 'there'},
              </p>

              <p style="
                margin:0 0 24px;
                color:#aaaaaa;
                font-size:14px;
                line-height:24px;
              ">
                We received a request to reset the password for your
                account. Click the button below to choose a new password.
              </p>

              <!-- Button -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">

                    <a
                      href="${resetUrl}"
                      style="
                        display:inline-block;
                        background-color:#FF6B00;
                        color:#000000;
                        text-decoration:none;
                        font-size:14px;
                        font-weight:bold;
                        padding:14px 28px;
                        border-radius:6px;
                      "
                    >
                      Reset Password
                    </a>

                  </td>
                </tr>
              </table>

              <p style="
                margin:24px 0 0;
                color:#777777;
                font-size:13px;
                line-height:21px;
                text-align:center;
              ">
                This password reset link will expire in
                <strong style="color:#aaaaaa;">15 minutes</strong>.
              </p>

              <!-- Fallback URL -->
              <div style="
                margin-top:24px;
                padding:16px;
                background-color:#0d0d0d;
                border:1px solid #222222;
                border-radius:6px;
              ">

                <p style="
                  margin:0 0 8px;
                  color:#555555;
                  font-size:11px;
                ">
                  If the button doesn't work, copy and paste this link:
                </p>

                <p style="
                  margin:0;
                  color:#FF6B00;
                  font-size:11px;
                  line-height:18px;
                  word-break:break-all;
                ">
                  ${resetUrl}
                </p>

              </div>

              <p style="
                margin:24px 0 0;
                color:#666666;
                font-size:12px;
                line-height:20px;
              ">
                If you didn't request a password reset, you can safely
                ignore this email. Your password will remain unchanged.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center"
              style="
                padding:20px 30px;
                border-top:1px solid #242424;
                background-color:#0d0d0d;
              ">

              <p style="
                margin:0;
                color:#555555;
                font-size:11px;
              ">
                © ${new Date().getFullYear()} Code With Bihar
              </p>

              <p style="
                margin:6px 0 0;
                color:#444444;
                font-size:10px;
              ">
                This is an automated email. Please do not reply.
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};


module.exports = {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
};
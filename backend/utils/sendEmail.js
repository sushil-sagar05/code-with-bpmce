const resend = require('../config/resend');
const mailjet = require('../config/mailjet');

const {
  verificationEmailTemplate,
  resetPasswordEmailTemplate,
} = require('./emailTemplates');


const sendWithResend = async ({
  to,
  subject,
  html,
}) => {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: [to],
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || 'Resend failed');
  }

  return {
    provider: 'resend',
    id: data?.id,
  };
};


const sendWithMailjet = async ({
  to,
  subject,
  html,
}) => {
  const request = await mailjet
    .post('send', {
      version: 'v3.1',
    })
    .request({
      Messages: [
        {
          From: {
            Email: process.env.EMAIL_FROM,
            Name: 'Your App',
          },

          To: [
            {
              Email: to,
            },
          ],

          Subject: subject,

          HTMLPart: html,
        },
      ],
    });

  return {
    provider: 'mailjet',
    id: request.body?.Messages?.[0]?.To?.[0]?.MessageID,
  };
};


const sendEmail = async ({
  to,
  subject,
  html,
}) => {

  /*
   * Try Resend first.
   */
  try {
    const result = await sendWithResend({
      to,
      subject,
      html,
    });

    console.log(
      `Email sent through Resend to ${to}`
    );

    return {
      success: true,
      ...result,
    };

  } catch (resendError) {

    console.error(
      'Resend failed:',
      resendError.message
    );

    /*
     * Resend failed.
     * Try Mailjet.
     */
    try {

      const result = await sendWithMailjet({
        to,
        subject,
        html,
      });

      console.log(
        `Email sent through Mailjet to ${to}`
      );

      return {
        success: true,
        ...result,
      };

    } catch (mailjetError) {

      console.error(
        'Mailjet failed:',
        mailjetError.message
      );

      return {
        success: false,
        message: 'Both email providers failed',
      };
    }
  }
};


const sendVerificationEmail = async (
  email,
  username,
  otp
) => {

  const html = verificationEmailTemplate(
    username,
    otp
  );

  return sendEmail({
    to: email,
    subject: 'Verify your email',
    html,
  });
};


const sendResetPasswordEmail = async (
  email,
  username,
  resetUrl
) => {

  const html = resetPasswordEmailTemplate(
    username,
    resetUrl
  );

  return sendEmail({
    to: email,
    subject: 'Reset your password',
    html,
  });
};


module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendResetPasswordEmail,
};
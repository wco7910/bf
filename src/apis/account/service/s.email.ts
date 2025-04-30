import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
const sesClient = new SESClient({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
});

export const MailService = {
  sendMail: async (email, token) => {
    const link = `https://v1api.humanb.kr/v1/admin/password?email=${email}&resetToken=${token}`;
    const info = new SendEmailCommand({
      Destination: {
        CcAddresses: [],
        // ToAddresses: [email],
        ToAddresses: [process.env?.EMAIL_SENDER],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `리셋 링크 : <a href="${link}">${link}</a>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: `이메일 재설정을 위한 링크`,
        },
      },
      Source: process.env?.EMAIL_SENDER,
      ReplyToAddresses: [],
    });
    const sent = await sesClient.send(info);

    return sent;
  },
};

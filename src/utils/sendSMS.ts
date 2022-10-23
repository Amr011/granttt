import axios from 'axios'

export async function sendSMS(otp: string, phone: string) {
   await axios({
      method: 'post',
      url: 'https://api.d7networks.com/messages/v1/send',
      headers: {
         'Content-Type': 'application/json',
         Accept: 'application/json',
         Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJhdXRoLWJhY2tlbmQ6YXBwIiwic3ViIjoiMzU4MTA0YWEtNzMwNC00ODM4LTlkOWEtNmNmZDUyOGE0M2NmIn0.Vy6OHTr4rbBhAWTud6U_b63ErON6C6wz8D7rUx5pexM',
      },

      data: {
         messages: [
            {
               channel: 'sms',
               recipients: [phone],
               content: `Your Verification Code \n ${otp}`,
               msg_type: 'text',
               data_coding: 'text',
            },
         ],
         message_globals: {
            originator: 'SignOTP',
            report_url: 'https://the_url_to_recieve_delivery_report.com',
         },
      },
   })
      .then(function (response: any) {
         console.log(JSON.stringify(response.data))
      })
      .catch(function (error: any) {
         console.log(error)
      })
}

using Application.Interfaces;
using Infrastructure.Configurations.EmailService;
using MailKit.Net.Smtp;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.InfrastructureServices
{
    public class EmailServices : IEmailServices
    {
        private readonly EmailConfiguration _emailConfig;

        public EmailServices(EmailConfiguration emailConfig)
        {
            _emailConfig = emailConfig;
        }

        public async Task<bool> SendEmailAsync(IEnumerable<string> toEmail, string subject, string message)
        {
            var messages = new Message(toEmail,subject, message);
            var emailMessage = CreateEmailMessage(messages);
            await SendAsync(emailMessage);
            return true;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string message)
        {
            var toEmails = new List<string> { toEmail};
            var messages = new Message(toEmails, subject, message);
            var emailMessage = CreateEmailMessage(messages);
            await SendAsync(emailMessage);
            return true;
        }

        private MimeMessage CreateEmailMessage(Message message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("email",_emailConfig.From));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;
            emailMessage.Body = new TextPart(MimeKit.Text.TextFormat.Text) { Text = message.Content };
            return emailMessage;
        }
        private async Task SendAsync(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_emailConfig.SmtpServer, _emailConfig.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(_emailConfig.UserName, _emailConfig.Password);
                    await client.SendAsync(mailMessage);
                }
                catch
                {
                    //log an error message or throw an exception or both.
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }
    }
}

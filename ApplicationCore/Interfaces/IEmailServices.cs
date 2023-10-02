using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IEmailServices
    {
        Task<bool> SendEmailAsync(IEnumerable<string> toEmail, string subject, string message);

        Task<bool> SendEmailAsync(string toEmail, string subject, string message);
    }
}

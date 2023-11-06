using Application.Interfaces;
using Infrastructure.InfrastructureServices;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.Net.Http.Headers;
using System.Text;

namespace CarHistoryReportSystemAPI.Utility
{
    public class CsvOutputFormatter : TextOutputFormatter
    {
        private ICsvServices _csvServices;
        public CsvOutputFormatter()
        {
            _csvServices = new CsvServices();
            SupportedMediaTypes.Add(MediaTypeHeaderValue.Parse("text/csv"));
            SupportedEncodings.Add(Encoding.UTF8);
            SupportedEncodings.Add(Encoding.Unicode);
        }

        public override async Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
        {
            var response = context.HttpContext.Response;
            response.Headers.Add("Content-Disposition", $"attachment;filename=data_{DateTime.Today:dd_MM_yyyy}.csv");
            string csvResponse;
            if (context.Object is IEnumerable<object> objects)
            {
                csvResponse = _csvServices.ConvertListObjectToCsvFormat(objects);
            }
            else
            {
                csvResponse = _csvServices.ConvertObjectToCsvFormat(context.Object);
            }
            await response.WriteAsync(csvResponse);
        }
    }
}

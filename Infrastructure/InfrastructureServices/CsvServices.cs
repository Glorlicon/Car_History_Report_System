using Application.Interfaces;
using CsvHelper;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Infrastructure.InfrastructureServices
{
    public class CsvServices : ICsvServices
    {
        public string ConvertListObjectToCsvFormat(IEnumerable<object> objects)
        {
            string result = "";
            using (var writer = new StringWriter())
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                csv.WriteRecords(objects);
                result = writer.ToString();    
            }
            return result;
        }

        public string ConvertObjectToCsvFormat(object obj)
        {
            string result = "";
            using (var writer = new StringWriter())
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                csv.WriteRecord(obj);
                result = writer.ToString();
            }
            return result;
        }

        public IEnumerable<T> ConvertToListObject<T>(Stream file)
        {
            var reader = new StreamReader(file);
            var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
            var records = csv.GetRecords<T>();
            return records.ToList();
        }
    }
}

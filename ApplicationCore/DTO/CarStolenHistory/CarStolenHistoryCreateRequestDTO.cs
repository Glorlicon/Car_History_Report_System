using Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarStolenHistory
{
    public class CarStolenHistoryCreateRequestDTO
    {
        public string? Description { get; set; }
        public string CarId { get; set; }
        public string? Note {  get; set; }
        public int? Odometer {  get; set; }
        public DateOnly? ReportDate {  get; set; }
        public CarStolenStatus Status {  get; set; }

    }
}

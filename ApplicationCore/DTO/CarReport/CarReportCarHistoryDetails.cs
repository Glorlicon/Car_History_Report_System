using Application.DTO.CarAccidentHistory;
using Application.DTO.CarInspectionHistory;
using Application.DTO.CarInsurance;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarRecall;
using Application.DTO.CarServiceHistory;
using Application.DTO.CarStolenHistory;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarReport
{
    public class CarReportCarHistoryDetails
    {
        public DateOnly StartDate { get; set; }
        public DateOnly EndDate { get; set; }
        public CarOwnerHistoryResponseDTO CarOwner { get; set; }

        public List<CarServiceHistoryResponseDTO> CarServiceHistories { get; set; }

        public List<CarAccidentHistoryResponseDTO> CarAccidentHistories { get; set; }
        public List<CarInspectionHistoryResponseDTO> CarInspectionHistories { get; set; }
        public List<CarInsuranceHistoryResponseDTO> CarInsurances { get; set; }
        public List<CarStolenHistoryResponseDTO> CarStolenHistories { get; set; }
        public List<GeneralCarHistoryResponseDTO> GeneralCarHistories { get; set; }
    }
}

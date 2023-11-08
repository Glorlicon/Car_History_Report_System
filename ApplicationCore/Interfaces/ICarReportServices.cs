using Application.DTO.CarReport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarReportServices
    {
        Task<CarReportResponseDTO> GetCarReportById(string carId, string userId, DateOnly date);

        Task<bool> IsCarReportExist(string carId, string userId);

        Task<IEnumerable<CarReportResponseDTO>> GetAllCarReports();

        Task<IEnumerable<CarReportResponseDTO>> GetCarReportsByUserId(string userId);

        Task<CarReportDataResponseDTO> GetCarReportDataByCarId(string carId, DateOnly date);

        Task AddCarReportToUserCarReportList(CarReportCreateRequestDTO request);
    }
}

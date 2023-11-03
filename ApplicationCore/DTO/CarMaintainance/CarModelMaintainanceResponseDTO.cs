using Application.DTO.ModelMaintainance;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.CarMaintainance
{
    public class CarModelMaintainanceResponseDTO
    {
        public ModelMaintainanceResponseDTO ModelMaintainance { get; set; }
        public int? LastOdometer { get; set; }
        public DateOnly? LastServicedDate { get; set; }
    }
}

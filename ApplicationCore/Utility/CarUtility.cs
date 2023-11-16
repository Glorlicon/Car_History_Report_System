using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Utility
{
    public static class CarUtility
    {
        public static int GetMaxCarOdometer(Car car)
        {
            if( car is null) return 0;
            int maxOdometer = 0;
            // Get max odometer of car insurance history
            var odometer = car.CarInsurances.Max(c => c.Odometer);
            odometer ??= 0;
            maxOdometer = Math.Max(maxOdometer, odometer.Value);

            // Get max odometer of CarAccidentHistories
            odometer = car.CarAccidentHistories.Max(c => c.Odometer);
            odometer ??= 0;
            maxOdometer = Math.Max(maxOdometer, odometer.Value);

            // Get max odometer of CarInspectionHistories
            odometer = car.CarInspectionHistories.Max(c => c.Odometer);
            odometer ??= 0;
            maxOdometer = Math.Max(maxOdometer, odometer.Value);

            // Get max odometer of CarOwnerHistories
            odometer = car.CarOwnerHistories.Max(c => c.Odometer);
            odometer ??= 0;
            maxOdometer = Math.Max(maxOdometer, odometer.Value);

            // Get max odometer of CarServiceHistories
            odometer = car.CarServiceHistories.Max(c => c.Odometer);
            odometer ??= 0;
            maxOdometer = Math.Max(maxOdometer, odometer.Value);

            // Get max odometer of CarStolenHistories
            odometer = car.CarStolenHistories.Max(c => c.Odometer);
            odometer ??= 0;
            maxOdometer = Math.Max(maxOdometer, odometer.Value);

            // Get max odometer of CarRegistrationHistories
            odometer = car.CarRegistrationHistories.Max(c => c.Odometer);
            odometer ??= 0;
            maxOdometer = Math.Max(maxOdometer, odometer.Value);

            return maxOdometer;
        }
    }
}

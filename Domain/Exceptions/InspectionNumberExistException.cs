﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Exceptions
{
    public class InspectionNumberExistException : BadRequestException
    {
        public InspectionNumberExistException()
            : base("Inspection Number already exist")
        {

        }
    }
}

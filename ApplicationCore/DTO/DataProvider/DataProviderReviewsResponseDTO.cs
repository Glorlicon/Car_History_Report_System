﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTO.DataProvider
{
    public class DataProviderReviewsResponseDTO
    {
        public int DataProviderId {  get; set; }
        public string UserId {  get; set; }
        public string? Description {  get; set; }

        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }

        public int Rating { get; set; }

        public DateTime CreatedTime { get; set; }
    }
}

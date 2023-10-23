﻿using Application.DTO.Authentication;
using Application.DTO.Car;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarPart;
using Application.DTO.CarSpecification;
using Application.DTO.DataProvider;
using Application.DTO.Request;
using Application.DTO.User;
using AutoMapper;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Common
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<RegistrationRequestDTO, User>();
            CreateMap<CarSpecificationCreateRequestDTO, CarSpecification>();
            CreateMap<CarSpecificationUpdateRequestDTO, CarSpecification>();
            CreateMap<CarSpecification, CarSpecificationResponseDTO>()
                .ForMember(csr => csr.ManufacturerName, opt => opt.MapFrom(x => x.Manufacturer.Name));
            CreateMap<User, UserResponseDTO>()
            .ForMember(urr => urr.IsSuspended, opt => opt.MapFrom(src => src.LockoutEnabled));
            CreateMap<User, CreateUserRequestDTO>();
            CreateMap<CreateUserRequestDTO, User>();
            CreateMap<UpdateUserRequestDTO, User>();

            CreateMap<DataProvider, DataProviderResponseDTO>()
                .ForMember(dp => dp.TypeName, opt => opt.MapFrom(x => x.Type.ToString()));
            CreateMap<Review, DataProviderReviewsResponseDTO>();
            CreateMap<WorkingTime, DataProviderWorkingTimesResponseDTO>();
            CreateMap<DataProviderCreateRequestDTO, DataProvider>();
            CreateMap<DataProviderUpdateRequestDTO, DataProvider>();
            CreateMap<DataProviderWorkingTimesCreateRequestDTO, WorkingTime>()
                .ForMember(dpwt => dpwt.StartTime, opt => opt.MapFrom(x => new TimeOnly(x.StartHour,x.StartMinute)))
                .ForMember(dpwt => dpwt.EndTime, opt => opt.MapFrom(x => new TimeOnly(x.EndHour,x.EndMinute)));
            CreateMap<DataProviderWorkingTimesUpdateRequestDTO, WorkingTime>()  
            .ForMember(dpwt => dpwt.StartTime, opt => opt.MapFrom(x => new TimeOnly(x.StartHour, x.StartMinute)))
                .ForMember(dpwt => dpwt.EndTime, opt => opt.MapFrom(x => new TimeOnly(x.EndHour, x.EndMinute)));


            CreateMap<CarCreateRequestDTO, Car>();
            CreateMap<CarUpdateRequestDTO, Car>();
            CreateMap<Car, CarResponseDTO>()
                .ForMember(c => c.ColorName, opt => opt.MapFrom(x => x.Color.ToString()));
            CreateMap<CarSalesInfoCreateRequestDTO, CarSalesInfo>();
            CreateMap<CarSalesInfoUpdateRequestDTO, CarSalesInfo>();
            CreateMap<CarSalesInfo, CarSalesInfoResponseDTO>();
            CreateMap<CarImages, CarImagesResponseDTO>();
            CreateMap<CarImagesCreateDTO, CarImages>();

            CreateMap<CarPartCreateRequestDTO, CarPart>();
            CreateMap<CarPartUpdateRequestDTO, CarPart>();
            CreateMap<CarPart, CarPartResponseDTO>()
                .ForMember(csr => csr.ManufacturerName, opt => opt.MapFrom(x => x.Manufacturer.Name));

            CreateMap<CarOwnerHistoryCreateRequestDTO, CarOwnerHistory>();
            CreateMap<CarOwnerHistoryUpdateRequestDTO, CarOwnerHistory>();
            CreateMap<CarOwnerHistory, CarOwnerHistoryResponseDTO>()
                .ForMember(c => c.DataSource, opt => opt.MapFrom(x => x.CreatedByUser.DataProvider.Name));

            CreateMap<RequestCreateRequestDTO, Request>();
            CreateMap<Request, RequestUpdateRequestDTO>();
            CreateMap<Request, RequestResponseDTO>();


        }
    }
}

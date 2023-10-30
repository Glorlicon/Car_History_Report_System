using Application.DTO.Authentication;
using Application.DTO.Car;
using Application.DTO.CarMaintainance;
using Application.DTO.CarOwnerHistory;
using Application.DTO.CarPart;
using Application.DTO.CarRecall;
using Application.DTO.CarServiceHistory;
using Application.DTO.CarSpecification;
using Application.DTO.DataProvider;
using Application.DTO.Order;
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

            CreateMap<DataProvider, DataProviderDetailsResponseDTO>()
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
            CreateMap<RequestUpdateRequestDTO, Request>();
            CreateMap<Request, RequestResponseDTO>();

            CreateMap<AddCarToTrackingListRequestDTO, CarMaintainance>();

            CreateMap<CarRecallCreateRequestDTO, CarRecall>();
            CreateMap<CarRecallUpdateRequestDTO, CarRecall>();
            CreateMap<CarRecall, CarRecallResponseDTO>();
            CreateMap<CarRecallStatus, CarRecallStatusResponseDTO>()
                .ForMember(c => c.Description, opt => opt.MapFrom(x => x.CarRecall.Description))
                .ForMember(c => c.ModelId, opt => opt.MapFrom(x => x.CarRecall.ModelId))
                .ForMember(c => c.RecallDate, opt => opt.MapFrom(x => x.CarRecall.RecallDate))
                .ForMember(c => c.Status, opt => opt.MapFrom(x => x.Status.ToString()));

            CreateMap<CarServiceHistory, CarServiceHistoryResponseDTO>()
                .ForMember(c => c.ServicesName, opt => opt.MapFrom(x => x.Services.ToString()));
            CreateMap<CarServiceHistoryCreateRequestDTO, CarServiceHistory>();
            CreateMap<CarServiceHistoryUpdateRequestDTO, CarServiceHistory>();

            CreateMap<Order, OrderResponseDTO>();
            CreateMap<OrderCreateRequestDTO, Order>();
            CreateMap<OrderOption, OrderOptionResponseDTO>();
            CreateMap<OrderOptionCreateRequestDTO, OrderOption>();
            CreateMap<OrderOptionUpdateRequestDTO, OrderOption>();
        }
    }
}

using BLL.Interface;
using Common.DTO;
using DAL.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.Service
{
    public class DimensionService : IDimensionService
    {
        private readonly IUnitOfWork _unitOfWork;

        public DimensionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<DimensionDTO>> GetAllDimensionsAsync()
        {
            var dimensions = await _unitOfWork.DimensionHealth.GetAll().ToListAsync();
            return dimensions.Select(d => new DimensionDTO
            {
                DimensionId = d.DimensionId,
                DimensionName = d.DimensionName
            });
        }
    }
}

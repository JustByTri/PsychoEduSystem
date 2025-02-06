using BLL.Interface;
using Common.DTO;
using DAL.Entities;
using DAL.UnitOfWork;

public class MentalHealthPointService : IMentalHealthPointService
{
    private readonly IUnitOfWork _unitOfWork;

    public MentalHealthPointService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<MentalHealthPointResponseDTO> AddMentalHealthPoints(MentalHealthPointInputDTO input)
    {
        // Kiểm tra xem người dùng có tồn tại không
        var userExists = await _unitOfWork.User.AnyAsync(u => u.UserId == input.UserId);
        if (!userExists)
        {
            throw new Exception("User  does not exist.");
        }

        var mentalHealthPoint = new MentalHealthPoint
        {
            MHPId = Guid.NewGuid(),
            UserId = input.UserId,
            CreateAt = DateTime.Now,
            MentalHealthPointDetails = new List<MentalHealthPointDetail>()
        };

        // Thêm chi tiết điểm
        mentalHealthPoint.MentalHealthPointDetails.Add(new MentalHealthPointDetail
        {
            MHPDId = Guid.NewGuid(),
            MHPId = mentalHealthPoint.MHPId,
            Point = input.AnxietyPoint,
            CategoryID = 1, // Giả sử 1 là ID cho loại lo âu
            CreateAt = DateTime.Now
        });

        mentalHealthPoint.MentalHealthPointDetails.Add(new MentalHealthPointDetail
        {
            MHPDId = Guid.NewGuid(),
            MHPId = mentalHealthPoint.MHPId,
            Point = input.DepressionPoint,
            CategoryID = 2, // Giả sử 2 là ID cho loại trầm cảm
            CreateAt = DateTime.Now
        });

        mentalHealthPoint.MentalHealthPointDetails.Add(new MentalHealthPointDetail
        {
            MHPDId = Guid.NewGuid(),
            MHPId = mentalHealthPoint.MHPId,
            Point = input.StressPoint,
            CategoryID = 3, // Giả sử 3 là ID cho loại căng thẳng
            CreateAt = DateTime.Now
        });

        await _unitOfWork.MentalHealthPoint.AddAsync(mentalHealthPoint);
        await _unitOfWork.SaveChangeAsync();

        // Tạo DTO để trả về
        var response = new MentalHealthPointResponseDTO
        {
            MHPId = mentalHealthPoint.MHPId,
            UserId = mentalHealthPoint.UserId,
            MentalHealthPointDetails = new List<MentalHealthPointDetailResponseDTO>()
        };

        // Lấy tên danh mục từ cơ sở dữ liệu
        foreach (var detail in mentalHealthPoint.MentalHealthPointDetails)
        {
            var category = await _unitOfWork.Category.GetByIdInt(detail.CategoryID); // Giả sử bạn có phương thức này
            response.MentalHealthPointDetails.Add(new MentalHealthPointDetailResponseDTO
            {
                MHPDId = detail.MHPDId,
                Point = detail.Point,
                CategoryName = category?.CategoryName 
            });
        }

        return response;
    }
}

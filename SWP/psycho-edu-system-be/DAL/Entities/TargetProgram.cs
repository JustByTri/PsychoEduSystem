﻿using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DAL.Entities
{
    public class TargetProgram
    {
        [Key]
        public Guid ProgramId { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public Guid CounselorId { get; set; }
        [ForeignKey("CounselorId")]
        public User Counselor { get; set; }
        public string Description { get; set; }
        public DateTime StartDate { get; set; }
        public int MinPoint { get; set; }
        public int Capacity { get; set; }
        //public Guid CreatedBy { get; set; }
        public DateTime CreateAt { get; set; }
        // Khóa ngoại liên kết với DimensionHealth
        public int DimensionId { get; set; }

        // Navigation property để lấy thông tin DimensionName
        public DimensionHealth Dimension { get; set; }
    }
}
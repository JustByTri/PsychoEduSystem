const mockData = {
  consultants: [
    {
      id: 1,
      name: "Dr. Sarah Wilson",
      role: "Counselor",
      type: "counselor",
      image: "/api/placeholder/200/200",
      specialties: ["Academic Counseling", "Career Guidance"],
      education: "Ph.D. in Psychology",
      experience: "15 years",
      description:
        "Specialized in helping students with academic and career choices.",
    },
    {
      id: 2,
      name: "Prof. James Miller",
      role: "Teacher",
      type: "teacher",
      classId: "class-1",
      image: "/api/placeholder/200/200",
    },
  ],
  students: [
    {
      id: 1,
      name: "Emma Smith",
      grade: "Grade 8",
      classId: "class-1",
      parentId: 101,
    },
    {
      id: 2,
      name: "John Smith",
      grade: "Grade 10",
      classId: "class-2",
      parentId: 102,
    },
  ],
};

// Helper function để mô phỏng lỗi ngẫu nhiên (tỉ lệ 10%)
const randomFail = () => Math.random() < 0.1;

// Helper function để mô phỏng độ trễ của API
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const bookingApi = {
  async fetchConsultants() {
    await delay(500);
    if (randomFail()) throw new Error("Failed to fetch consultants");
    return mockData.consultants;
  },

  async fetchStudents(parentId) {
    await delay(500);
    if (randomFail()) throw new Error("Failed to fetch students");
    return mockData.students.filter((student) => student.parentId === parentId);
  },

  async fetchConsultantDetails(id) {
    await delay(500);
    if (randomFail()) throw new Error("Failed to fetch consultant details");
    return mockData.consultants.find((c) => c.id === id);
  },

  async checkSlotAvailability(consultantId, date) {
    await delay(500);
    if (randomFail()) throw new Error("Slot availability check failed");

    // Tạo danh sách thời gian slot ngẫu nhiên
    const allSlots = [
      "09:00 AM",
      "10:00 AM",
      "11:00 AM",
      "02:00 PM",
      "04:00 PM",
    ];
    const randomSlots = allSlots.filter(() => Math.random() > 0.5);

    return { available: randomSlots.length > 0, slots: randomSlots };
  },

  async createBooking(bookingData) {
    await delay(500);
    if (randomFail()) throw new Error("Booking creation failed");
    return { success: true, bookingId: Math.floor(Math.random() * 10000) };
  },
};

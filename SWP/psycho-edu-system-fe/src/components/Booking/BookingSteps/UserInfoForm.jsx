import { useBooking } from "../../../context/BookingContext";

export const UserInfoForm = () => {
  const { bookingData, updateBookingData } = useBooking();

  const handleChange = (e) => {
    const { name, value } = e.target;
    updateBookingData({ [name]: value });
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Your Contact Information
      </h2>

      <div className="space-y-6">
        <div>
          <label
            htmlFor="userName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Full Name
          </label>
          <input
            type="text"
            id="userName"
            name="userName"
            value={bookingData.userName}
            onChange={handleChange}
            className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out
                       placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={bookingData.phone}
            onChange={handleChange}
            className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out
                       placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your phone number"
            required
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={bookingData.email}
            onChange={handleChange}
            className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm 
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out
                       placeholder-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
            placeholder="Enter your email address"
            required
          />
        </div>
      </div>
    </div>
  );
};

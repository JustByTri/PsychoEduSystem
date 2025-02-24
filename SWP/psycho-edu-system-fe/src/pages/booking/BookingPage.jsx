// import { useState, useEffect } from "react";
// import { BookingProvider, useBooking } from "../../context/BookingContext";
// import { toast, ToastContainer } from "react-toastify";
// import { FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
// import { validateStep } from "../../utils/validation";
// import { DateTimeSelection } from "../../components/Booking/BookingSteps/DataTimeSelection";
// import { ConsultantSelection } from "../../components/Booking/BookingSteps/ConsultantSelection";
// import { UserInfoForm } from "../../components/Booking/BookingSteps/UserInfoForm";
// import { ConfirmationStep } from "../../components/Booking/BookingSteps/ConfirmationStep";
// import { ProgressBar } from "../../components/Booking/ProcessBar";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext"; // Assume this exists

// // New Child Selection Component
// const ChildSelection = () => {
//   const { updateBookingData, bookingData } = useBooking();
//   const { user } = useAuth();

//   const handleChildSelect = (childId, childName) => {
//     updateBookingData({
//       childId,
//       childName,
//       studentId: childId, // Store for homeroom teacher lookup
//     });
//   };

//   return (
//     <div className="py-6">
//       <h2 className="text-xl font-semibold mb-4">Select Child</h2>
//       <div className="space-y-3">
//         {user.children.map((child) => (
//           <div
//             key={child.id}
//             onClick={() => handleChildSelect(child.id, child.name)}
//             className={`p-4 border rounded-md cursor-pointer transition-colors
//               ${
//                 bookingData.childId === child.id
//                   ? "border-blue-500 bg-blue-50"
//                   : "border-gray-200 hover:border-blue-300"
//               }`}
//           >
//             <div className="flex items-center">
//               <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                 {child.name.charAt(0)}
//               </div>
//               <div className="ml-3">
//                 <p className="font-medium">{child.name}</p>
//                 <p className="text-sm text-gray-500">Grade {child.grade}</p>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// // New Consultant Type Selection Component
// const ConsultantTypeSelection = () => {
//   const { updateBookingData, bookingData } = useBooking();
//   const { user } = useAuth();

//   const handleConsultantTypeSelect = async (type) => {
//     updateBookingData({ consultantType: type });

//     if (type === "homeroom") {
//       try {
//         // Determine which student ID to use
//         const studentId =
//           user.role === "parent" ? bookingData.childId : user.id;

//         // Fetch homeroom teacher
//         const response = await fetch(
//           `/api/students/${studentId}/homeroom-teacher`
//         );
//         const teacher = await response.json();

//         // Automatically set the homeroom teacher
//         updateBookingData({
//           consultantId: teacher.id,
//           consultantName: teacher.name,
//           isHomeroomTeacher: true,
//         });
//       } catch (error) {
//         toast.error("Failed to fetch homeroom teacher");
//       }
//     }
//   };

//   return (
//     <div className="py-6">
//       <h2 className="text-xl font-semibold mb-4">Select Consultant Type</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div
//           onClick={() => handleConsultantTypeSelect("counselor")}
//           className={`p-6 border rounded-md cursor-pointer text-center transition-colors
//             ${
//               bookingData.consultantType === "counselor"
//                 ? "border-blue-500 bg-blue-50"
//                 : "border-gray-200 hover:border-blue-300"
//             }`}
//         >
//           <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-3">
//             <span className="text-2xl">👨‍💼</span>
//           </div>
//           <h3 className="font-medium mb-2">Counselor</h3>
//           <p className="text-sm text-gray-600">
//             Book with a counselor of your choice
//           </p>
//         </div>

//         <div
//           onClick={() => handleConsultantTypeSelect("homeroom")}
//           className={`p-6 border rounded-md cursor-pointer text-center transition-colors
//             ${
//               bookingData.consultantType === "homeroom"
//                 ? "border-green-500 bg-green-50"
//                 : "border-gray-200 hover:border-green-300"
//             }`}
//         >
//           <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-3">
//             <span className="text-2xl">👨‍🏫</span>
//           </div>
//           <h3 className="font-medium mb-2">Homeroom Teacher</h3>
//           <p className="text-sm text-gray-600">
//             Book with your assigned homeroom teacher
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// const BookingPageContent = () => {
//   const [step, setStep] = useState(1);
//   const { bookingData, updateBookingData } = useBooking();
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   // Calculate total steps based on user role and children
//   const [totalSteps, setTotalSteps] = useState(4);

//   useEffect(() => {
//     // Determine total steps based on user role
//     if (user.role === "parent" && user.children?.length > 1) {
//       setTotalSteps(5); // Extra step for child selection
//     } else {
//       setTotalSteps(4);
//     }

//     // Initialize user data
//     updateBookingData({
//       userId: user.id,
//       userName: user.name,
//       userRole: user.role,
//     });

//     // For parent with single child, preset the child
//     if (user.role === "parent" && user.children?.length === 1) {
//       const child = user.children[0];
//       updateBookingData({
//         childId: child.id,
//         childName: child.name,
//         studentId: child.id,
//       });
//     }
//   }, [user]);

//   const handleNext = async () => {
//     const validationResult = validateStep(step, bookingData);

//     if (validationResult === true) {
//       // Special case: If homeroom teacher is selected, skip consultant selection
//       if (
//         bookingData.consultantType === "homeroom" &&
//         ((user.role === "student" && step === 1) ||
//           (user.role === "parent" && user.children?.length > 1 && step === 2) ||
//           (user.role === "parent" && user.children?.length === 1 && step === 1))
//       ) {
//         setStep((prev) => prev + 2); // Skip consultant selection step
//       } else {
//         setStep((prev) => prev + 1);
//       }
//     } else {
//       toast.error(validationResult);
//     }
//   };

//   const handleBack = () => {
//     // Special case: If coming back from date selection with homeroom teacher
//     if (bookingData.consultantType === "homeroom") {
//       if (
//         (user.role === "student" && step === 3) ||
//         (user.role === "parent" && user.children?.length === 1 && step === 3) ||
//         (user.role === "parent" && user.children?.length > 1 && step === 4)
//       ) {
//         setStep((prev) => prev - 2); // Go back to consultant type selection
//         return;
//       }
//     }

//     setStep((prev) => prev - 1);
//   };

//   const handleConfirm = async () => {
//     try {
//       // Gather all booking data
//       const bookingPayload = {
//         ...bookingData,
//         timestamp: new Date().toISOString(),
//       };

//       // Call API to create booking
//       const response = await fetch("/api/bookings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(bookingPayload),
//       });

//       if (!response.ok) throw new Error("Booking creation failed");

//       toast.success("Booking confirmed successfully!");
//       setTimeout(() => navigate("/dashboard"), 2000);
//     } catch (error) {
//       toast.error("Failed to confirm booking: " + error.message);
//     }
//   };

//   // Determine which component to show based on user role and step
//   const renderStepContent = () => {
//     // For students
//     if (user.role === "student") {
//       switch (step) {
//         case 1:
//           return <ConsultantTypeSelection />;
//         case 2:
//           return bookingData.consultantType === "counselor" ? (
//             <ConsultantSelection />
//           ) : (
//             <DateTimeSelection />
//           );
//         case 3:
//           return bookingData.consultantType === "counselor" ? (
//             <DateTimeSelection />
//           ) : (
//             <UserInfoForm />
//           );
//         case 4:
//           return bookingData.consultantType === "counselor" ? (
//             <UserInfoForm />
//           ) : (
//             <ConfirmationStep />
//           );
//         case 5:
//           return <ConfirmationStep />;
//         default:
//           return null;
//       }
//     }

//     // For parents with multiple children
//     if (user.role === "parent" && user.children?.length > 1) {
//       switch (step) {
//         case 1:
//           return <ChildSelection />;
//         case 2:
//           return <ConsultantTypeSelection />;
//         case 3:
//           return bookingData.consultantType === "counselor" ? (
//             <ConsultantSelection />
//           ) : (
//             <DateTimeSelection />
//           );
//         case 4:
//           return bookingData.consultantType === "counselor" ? (
//             <DateTimeSelection />
//           ) : (
//             <UserInfoForm />
//           );
//         case 5:
//           return bookingData.consultantType === "counselor" ? (
//             <UserInfoForm />
//           ) : (
//             <ConfirmationStep />
//           );
//         case 6:
//           return <ConfirmationStep />;
//         default:
//           return null;
//       }
//     }

//     // For parents with a single child
//     if (user.role === "parent" && user.children?.length === 1) {
//       switch (step) {
//         case 1:
//           return <ConsultantTypeSelection />;
//         case 2:
//           return bookingData.consultantType === "counselor" ? (
//             <ConsultantSelection />
//           ) : (
//             <DateTimeSelection />
//           );
//         case 3:
//           return bookingData.consultantType === "counselor" ? (
//             <DateTimeSelection />
//           ) : (
//             <UserInfoForm />
//           );
//         case 4:
//           return bookingData.consultantType === "counselor" ? (
//             <UserInfoForm />
//           ) : (
//             <ConfirmationStep />
//           );
//         case 5:
//           return <ConfirmationStep />;
//         default:
//           return null;
//       }
//     }
//   };

//   // Calculate current progress for progress bar
//   const calculateProgress = () => {
//     if (bookingData.consultantType === "homeroom") {
//       // Adjust for skipped step
//       const adjustedStep = step > 2 ? step - 1 : step;
//       return user.role === "parent" && user.children?.length > 1
//         ? adjustedStep
//         : adjustedStep;
//     }
//     return step;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
//         <ProgressBar
//           currentStep={calculateProgress()}
//           totalSteps={
//             bookingData.consultantType === "homeroom"
//               ? totalSteps - 1
//               : totalSteps
//           }
//         />

//         {renderStepContent()}

//         <div className="mt-8 flex justify-between">
//           {step > 1 && (
//             <button
//               onClick={handleBack}
//               className="flex items-center px-4 py-2 bg-gray-200 text-gray-700
//                         rounded-lg hover:bg-gray-300 transition-colors"
//             >
//               <FaArrowLeft className="mr-2" /> Back
//             </button>
//           )}

//           {step < totalSteps ? (
//             <button
//               onClick={handleNext}
//               className="ml-auto flex items-center px-4 py-2 bg-blue-600
//                         text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Next <FaArrowRight className="ml-2" />
//             </button>
//           ) : (
//             <button
//               onClick={handleConfirm}
//               className="ml-auto flex items-center px-4 py-2 bg-green-600
//                         text-white rounded-lg hover:bg-green-700 transition-colors"
//             >
//               Confirm Booking <FaCheckCircle className="ml-2" />
//             </button>
//           )}
//         </div>
//       </div>
//       <ToastContainer position="bottom-right" />
//     </div>
//   );
// };

// // Wrapper component that provides context
// const BookingPage = () => {
//   return (
//     <BookingProvider>
//       <BookingPageContent />
//     </BookingProvider>
//   );
// };

// export default BookingPage;
export default function BookingPage() {
  return <div></div>;
}

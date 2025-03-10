import React from "react";
import { CCard, CCardBody, CRow, CCol, CButton, CSpinner } from "@coreui/react";
import { FaClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

const AppointmentsList = ({
  isLoading,
  filteredAppointments,
  handleViewDetail,
  handleCancelAppointment,
  handleChat,
  handleNavigate,
  selectedDate,
}) => {
  return (
    <div className="appointments-container scrollbar-hide">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <CSpinner color="primary" />
        </div>
      ) : filteredAppointments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                whileHover={{ scale: 1.02 }}
                onDoubleClick={() => handleViewDetail(appointment)}
              >
                <CCard
                  className="shadow-md border-0 bg-blue-50 dark:bg-gray-800"
                  style={{ borderRadius: "15px" }}
                >
                  <CCardBody className="p-4">
                    <CRow className="align-items-center mb-3">
                      <CCol xs={12} className="text-center">
                        <span
                          className="text-blue-600 dark:text-blue-300"
                          style={{ fontSize: "16px" }}
                        >
                          Consultant
                        </span>
                        <h5
                          className="mb-0 mt-1"
                          style={{
                            fontWeight: "bold",
                            color: "#2b2d42",
                            fontSize: "24px",
                          }}
                        >
                          {appointment.consultant || "Unknown Consultant"}
                        </h5>
                      </CCol>
                    </CRow>

                    <CRow className="align-items-center mb-4">
                      <CCol xs={12}>
                        <div className="flex items-center mb-2">
                          <FaClock
                            className="mr-2"
                            style={{ color: "#3b82f6", fontSize: "20px" }}
                          />
                          <span
                            style={{
                              fontSize: "18px",
                              color: "#2b2d42",
                              fontWeight: "500",
                            }}
                          >
                            {format(appointment.date, "EEE, do MMM")}{" "}
                            {appointment.time}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span
                            style={{
                              fontSize: "16px",
                              color:
                                appointment.type === "Online"
                                  ? "#3b82f6"
                                  : "#8b5cf6",
                              fontWeight: "500",
                            }}
                          >
                            {appointment.type}
                          </span>
                          <span
                            style={{
                              fontSize: "16px",
                              color:
                                appointment.status === "Completed"
                                  ? "#22c55e"
                                  : appointment.status === "Cancelled"
                                  ? "#ef4444"
                                  : "#f59e0b",
                              fontWeight: "500",
                            }}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </CCol>
                    </CRow>

                    <CRow className="align-items-center">
                      <CCol xs={12} className="text-center">
                        <div className="flex flex-wrap justify-center gap-2">
                          {appointment.status !== "Completed" &&
                            appointment.status !== "Cancelled" && (
                              <CButton
                                color="primary"
                                className="shadow-sm hover:shadow-md transition-all duration-200"
                                style={{
                                  borderRadius: "20px",
                                  backgroundColor: "#3b82f6",
                                  borderColor: "#3b82f6",
                                  fontWeight: "bold",
                                  fontSize: "0.9rem",
                                  padding: "8px 20px",
                                  width: "100px",
                                  height: "40px",
                                  textDecoration: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={() => handleChat(appointment.id)}
                              >
                                Join
                              </CButton>
                            )}
                          {appointment.type === "Online" &&
                            appointment.googleMeetURL && (
                              <CButton
                                color="info"
                                href={appointment.googleMeetURL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shadow-sm hover:shadow-md transition-all duration-200"
                                style={{
                                  borderRadius: "20px",
                                  backgroundColor: "#10b981",
                                  borderColor: "#10b981",
                                  fontWeight: "bold",
                                  fontSize: "0.9rem",
                                  padding: "8px 20px",
                                  width: "130px",
                                  height: "40px",
                                  textDecoration: "none",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  color: "white",
                                }}
                              >
                                Join Google Meet
                              </CButton>
                            )}
                          <CButton
                            color="secondary"
                            className="shadow-sm hover:shadow-md transition-all duration-200"
                            style={{
                              borderRadius: "20px",
                              backgroundColor: "#8b5cf6",
                              borderColor: "#8b5cf6",
                              fontWeight: "bold",
                              fontSize: "0.9rem",
                              padding: "8px 20px",
                              width: "100px",
                              height: "40px",
                              textDecoration: "none",
                              color: "white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={() => handleViewDetail(appointment)}
                          >
                            Detail
                          </CButton>
                          {appointment.status !== "Cancelled" && (
                            <CButton
                              color="danger"
                              className="shadow-sm hover:shadow-md transition-all duration-200"
                              style={{
                                borderRadius: "20px",
                                backgroundColor: "#ef4444",
                                borderColor: "#ef4444",
                                fontWeight: "bold",
                                fontSize: "0.9rem",
                                padding: "8px 20px",
                                width: "100px",
                                height: "40px",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={() =>
                                handleCancelAppointment(
                                  appointment.appointmentId
                                )
                              }
                            >
                              Cancel
                            </CButton>
                          )}
                        </div>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-10">
          <h5 className="text-blue-600 dark:text-blue-400 text-lg">
            No appointments for {format(selectedDate, "EEEE, MM/dd/yyyy")}
          </h5>
          <button
            onClick={handleNavigate}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            Schedule a New Appointment
          </button>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;

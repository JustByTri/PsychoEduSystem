// hooks/useConsultant.js
import { useState, useEffect } from "react";
import { consultantService } from "../api/services/consultant";


export const useConsultant = (type) => {
  const [consultants, setConsultants] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsultants = async () => {
      try {
        const response = await consultantService.getConsultants(type);
        setConsultants(response.data || []); // Ensure we set an array
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchConsultants();
  }, [type]);

  return { consultants, loading, error };
};

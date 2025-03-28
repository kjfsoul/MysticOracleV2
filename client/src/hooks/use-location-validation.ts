
import { apiRequest } from "@/lib/api";
import { useState, useEffect } from "react";

export function useLocationValidation(location: string) {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const validateLocation = async () => {
      if (!location || location.length < 3) {
        setIsValid(false);
        return;
      }

      setIsValidating(true);
      try {
        const response = await apiRequest.post('/api/validate-location', { location });
        setIsValid(response.data.valid);
        setError(null);
      } catch (err) {
        setIsValid(false);
        setError('Location validation failed');
      } finally {
        setIsValidating(false);
      }
    };

    const debounceTimer = setTimeout(validateLocation, 500);
    return () => clearTimeout(debounceTimer);
  }, [location]);

  return { isValidating, isValid, error };
}

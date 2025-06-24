import { useStaticData } from "./use-static-data";

/**
 * @deprecated Use useStaticData() instead - this hook now just wraps it
 * Will be removed in future version
 */
export function useGlobalData() {
  // Just use the static data hook - no need for separate implementation
  const { types, departments, interests, isLoading } = useStaticData();

  return {
    types,
    departments,
    interests,
    isLoading,
    isLoadingTypes: isLoading,
    isLoadingDepartments: isLoading,
    isLoadingInterests: isLoading,
  };
} 
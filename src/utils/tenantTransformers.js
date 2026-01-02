/**
 * Tenant Data Transformers
 *
 * Utility functions to transform tenant data between UI format (camelCase)
 * and API format (snake_case)
 */

/**
 * Transform tenant data from UI format to API format
 * @param {Object} uiData - Tenant data from UI (camelCase)
 * @returns {Object} Tenant data for API (snake_case)
 */
export const transformTenantToAPI = (uiData) => {
  // Convert Date object to YYYY-MM-DD string if needed
  let dateOfBirth = uiData.dateOfBirth || null;
  if (dateOfBirth instanceof Date) {
    // Extract just the date part (YYYY-MM-DD)
    dateOfBirth = dateOfBirth.toISOString().split('T')[0];
  } else if (dateOfBirth && typeof dateOfBirth === 'string') {
    // If it's already a string, ensure it's just the date part (YYYY-MM-DD)
    dateOfBirth = dateOfBirth.split('T')[0];
  }

  // Clean phone numbers - remove spaces and non-digit characters except '+'
  const cleanPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/\s+/g, ''); // Remove all spaces
  };

  return {
    first_name: uiData.firstName || '',
    family_name: uiData.lastName || '',
    email: uiData.email || '',
    phone: cleanPhone(uiData.phone) || '',
    date_of_birth: dateOfBirth,
    id_number: uiData.idNumber || null,
    emergency_contact_name: uiData.emergencyContactName || null,
    emergency_contact_phone: cleanPhone(uiData.emergencyContactPhone) || null,
    guarantor_first_name: uiData.guarantorFirstName || '',
    guarantor_family_name: uiData.guarantorLastName || '',
    guarantor_relationship: uiData.guarantorRelationship || '',
    guarantor_phone: cleanPhone(uiData.guarantorPhone) || '',
    guarantor_email: uiData.guarantorEmail || null,
    guarantor_address: uiData.guarantorAddress || null,
    notes: uiData.notes || null,
    id_attachment: uiData.idAttachment || null,
    phone_verified: uiData.phoneVerified || false,
  };
};

/**
 * Transform tenant data from API format to UI format
 * @param {Object} apiData - Tenant data from API (snake_case)
 * @returns {Object} Tenant data for UI (camelCase)
 */
export const transformTenantFromAPI = (apiData) => {
  return {
    tenantId: apiData.tenant_id || '',
    firstName: apiData.first_name || '',
    lastName: apiData.family_name || '',
    name: apiData.name || `${apiData.first_name || ''} ${apiData.family_name || ''}`.trim(),
    email: apiData.email || '',
    phone: apiData.phone || '',
    phoneVerified: apiData.phone_verified || false,
    dateOfBirth: apiData.date_of_birth || '',
    idNumber: apiData.id_number || '',
    emergencyContactName: apiData.emergency_contact_name || '',
    emergencyContactPhone: apiData.emergency_contact_phone || '',
    guarantorFirstName: apiData.guarantor_first_name || '',
    guarantorLastName: apiData.guarantor_family_name || '',
    // Compute guarantorName client-side since API doesn't return it
    guarantorName: `${apiData.guarantor_first_name || ''} ${apiData.guarantor_family_name || ''}`.trim(),
    guarantorRelationship: apiData.guarantor_relationship || '',
    guarantorPhone: apiData.guarantor_phone || '',
    guarantorEmail: apiData.guarantor_email || '',
    guarantorAddress: apiData.guarantor_address || '',
    notes: apiData.notes || '',
    idAttachment: apiData.id_attachment || null,
    // Audit fields
    createdBy: apiData.audit?.created_by || '',
    createdDate: apiData.audit?.created_date || '',
    modifiedBy: apiData.audit?.modified_by || '',
    modifiedDate: apiData.audit?.modified_date || '',
  };
};

/**
 * Transform array of tenants from API to UI format
 * @param {Array} apiTenants - Array of tenant data from API
 * @returns {Array} Array of tenant data for UI
 */
export const transformTenantsFromAPI = (apiTenants) => {
  if (!Array.isArray(apiTenants)) return [];
  return apiTenants.map(transformTenantFromAPI);
};

import { gql } from '@apollo/client';

/**
 * GraphQL Queries for Philippine Regions, Provinces, and Cities
 *
 * These queries work with the actual API at:
 * https://pr-api-dev.cloudpro.work/graphql
 */

// ============================================================================
// Health Check
// ============================================================================

export const PING = gql`
  query Ping {
    ping
  }
`;

// ============================================================================
// Region Queries
// ============================================================================

export const GET_ALL_REGIONS = gql`
  query GetAllRegions {
    getAllRegions {
      code
      success
      message
      regions {
        psgc_code
        code
        name
      }
    }
  }
`;

// ============================================================================
// Province Queries
// ============================================================================

export const GET_PROVINCES_BY_REGION = gql`
  query GetProvincesByRegion($region_psgc_code: NonEmptyString!) {
    getProvincesByRegion(region_psgc_code: $region_psgc_code) {
      code
      success
      message
      provinces {
        psgc_code
        code
        name
      }
    }
  }
`;

// ============================================================================
// City Queries
// ============================================================================

export const GET_CITIES_BY_PROVINCE = gql`
  query GetCitiesByProvince($province_psgc_code: NonEmptyString!) {
    getCitiesByProvince(province_psgc_code: $province_psgc_code) {
      code
      success
      message
      cities {
        psgc_code
        code
        name
      }
    }
  }
`;

// ============================================================================
// Property/Building Queries
// ============================================================================

export const GET_ALL_PROPERTIES = gql`
  query GetAllProperties($page: PageInput) {
    getAllProperties(page: $page) {
      code
      success
      message
      properties {
        building_id
        name
        address
        region_psgc_code
        province_psgc_code
        city_psgc_code
        region {
          psgc_code
          name
        }
        province {
          psgc_code
          name
        }
        city {
          psgc_code
          name
        }
        landmark
        totalRooms
        floors
        description
        contactPerson
        contactPhone
        latitude
        longitude
        photos
      }
    }
  }
`;

export const GET_PROPERTY = gql`
  query GetProperty($building_id: NonEmptyString!) {
    getProperty(building_id: $building_id) {
      code
      success
      message
      property {
        building_id
        name
        address
        region_psgc_code
        province_psgc_code
        city_psgc_code
        region {
          psgc_code
          name
        }
        province {
          psgc_code
          name
        }
        city {
          psgc_code
          name
        }
        landmark
        totalRooms
        floors
        description
        contactPerson
        contactPhone
        latitude
        longitude
        photos
        audit {
          created_by
          created_date
          modified_by
          modified_date
        }
      }
    }
  }
`;

// ============================================================================
// Property/Building Mutations
// ============================================================================

export const CREATE_PROPERTY = gql`
  mutation CreateProperty($input: PropertyInput!) {
    createProperty(input: $input) {
      code
      success
      message
      building_id
      property {
        building_id
        name
        address
        region_psgc_code
        province_psgc_code
        city_psgc_code
        region {
          psgc_code
          name
        }
        province {
          psgc_code
          name
        }
        city {
          psgc_code
          name
        }
        landmark
        totalRooms
        floors
        description
        contactPerson
        contactPhone
        latitude
        longitude
        photos
        audit {
          created_by
          created_date
        }
      }
    }
  }
`;

export const UPDATE_PROPERTY = gql`
  mutation UpdateProperty($building_id: NonEmptyString!, $input: PropertyInput!) {
    updateProperty(building_id: $building_id, input: $input) {
      code
      success
      message
      property {
        building_id
        name
        address
        region_psgc_code
        province_psgc_code
        city_psgc_code
        region {
          psgc_code
          name
        }
        province {
          psgc_code
          name
        }
        city {
          psgc_code
          name
        }
        landmark
        totalRooms
        floors
        description
        contactPerson
        contactPhone
        latitude
        longitude
        photos
        audit {
          modified_by
          modified_date
        }
      }
    }
  }
`;

// ============================================================================
// Amenity Queries
// ============================================================================

export const GET_ALL_AMENITIES = gql`
  query GetAllAmenities {
    getAllAmenities {
      code
      success
      message
      amenities {
        pk
        sk
        code
        label
        category
        sortOrder
        isActive
      }
    }
  }
`;

// ============================================================================
// Room/Unit Queries
// ============================================================================

export const GET_ALL_ROOMS = gql`
  query GetAllRooms($page: PageInput) {
    getAllRooms(page: $page) {
      code
      success
      message
      rooms {
        room_id
        building_id
        building {
          building_id
          name
        }
        roomNumber
        floor
        hasSeparateMeter
        electricMeter
        rent
        capacity
        size
        description
        amenities
        status
        deleted
        tenant {
          tenant_id
          name
          email
          phone
          moveInDate
        }
        audit {
          created_by
          created_date
          modified_by
          modified_date
          deleted_by
          deleted_date
        }
      }
    }
  }
`;

export const GET_ROOM = gql`
  query GetRoom($room_id: NonEmptyString!) {
    getRoom(room_id: $room_id) {
      code
      success
      message
      room {
        room_id
        building_id
        building {
          building_id
          name
        }
        roomNumber
        floor
        hasSeparateMeter
        electricMeter
        rent
        capacity
        size
        description
        amenities
        status
        tenant {
          tenant_id
          name
          email
          phone
          moveInDate
        }
        audit {
          created_by
          created_date
          modified_by
          modified_date
        }
      }
    }
  }
`;

export const GET_ROOMS_BY_BUILDING = gql`
  query GetRoomsByBuilding($building_id: NonEmptyString!) {
    getRoomsByBuilding(building_id: $building_id) {
      code
      success
      message
      rooms {
        room_id
        building_id
        building {
          building_id
          name
        }
        roomNumber
        floor
        hasSeparateMeter
        electricMeter
        rent
        capacity
        size
        description
        amenities
        status
        deleted
        tenant {
          tenant_id
          name
          email
          phone
          moveInDate
        }
        audit {
          created_by
          created_date
          modified_by
          modified_date
          deleted_by
          deleted_date
        }
      }
    }
  }
`;

// ============================================================================
// Room/Unit Mutations
// ============================================================================

export const CREATE_ROOM = gql`
  mutation CreateRoom($input: RoomInput!) {
    createRoom(input: $input) {
      code
      success
      message
      room_id
      room {
        room_id
        building_id
        building {
          building_id
          name
        }
        roomNumber
        floor
        hasSeparateMeter
        electricMeter
        rent
        capacity
        size
        description
        amenities
        status
        audit {
          created_by
          created_date
        }
      }
    }
  }
`;

export const UPDATE_ROOM = gql`
  mutation UpdateRoom($room_id: NonEmptyString!, $input: RoomInput!) {
    updateRoom(room_id: $room_id, input: $input) {
      code
      success
      message
      room {
        room_id
        building_id
        building {
          building_id
          name
        }
        roomNumber
        floor
        hasSeparateMeter
        electricMeter
        rent
        capacity
        size
        description
        amenities
        status
        audit {
          modified_by
          modified_date
        }
      }
    }
  }
`;

export const DELETE_ROOM = gql`
  mutation DeleteRoom($room_id: NonEmptyString!) {
    deleteRoom(room_id: $room_id) {
      code
      success
      message
    }
  }
`;

// ============================================================================
// Tenant Queries
// ============================================================================

export const GET_ALL_TENANTS = gql`
  query GetAllTenants($page: PageInput) {
    getAllTenants(page: $page) {
      code
      success
      message
      tenants {
        tenant_id
        first_name
        family_name
        name
        email
        phone
        date_of_birth
        id_number
        emergency_contact_name
        emergency_contact_phone
        guarantor_first_name
        guarantor_family_name
        guarantor_relationship
        guarantor_phone
        guarantor_email
        guarantor_address
        notes
        id_attachment
        phone_verified
        audit {
          created_by
          created_date
          modified_by
          modified_date
        }
      }
      total_count
      has_more
    }
  }
`;

export const GET_TENANT = gql`
  query GetTenant($tenant_id: NonEmptyString!) {
    getTenant(tenant_id: $tenant_id) {
      code
      success
      message
      tenant {
        tenant_id
        first_name
        family_name
        name
        email
        phone
        date_of_birth
        id_number
        emergency_contact_name
        emergency_contact_phone
        guarantor_first_name
        guarantor_family_name
        guarantor_relationship
        guarantor_phone
        guarantor_email
        guarantor_address
        notes
        id_attachment
        phone_verified
        audit {
          created_by
          created_date
          modified_by
          modified_date
        }
      }
    }
  }
`;

export const SEARCH_TENANT = gql`
  query SearchTenant($search_string: NonEmptyString!) {
    searchTenant(search_string: $search_string) {
      code
      success
      message
      tenants {
        tenant_id
        first_name
        family_name
        name
        email
        phone
        phone_verified
      }
    }
  }
`;

export const CHECK_PHONE_UNIQUENESS = gql`
  query CheckPhoneUniqueness($phone: PhoneNumber!, $exclude_tenant_id: String) {
    checkPhoneUniqueness(phone: $phone, exclude_tenant_id: $exclude_tenant_id) {
      code
      success
      message
      is_unique
      existing_tenant_id
    }
  }
`;

export const CHECK_EMAIL_UNIQUENESS = gql`
  query CheckEmailUniqueness($email: EmailAddress!, $exclude_tenant_id: String) {
    checkEmailUniqueness(email: $email, exclude_tenant_id: $exclude_tenant_id) {
      code
      success
      message
      is_unique
      existing_tenant_id
    }
  }
`;

// ============================================================================
// Tenant Mutations
// ============================================================================

export const CREATE_TENANT = gql`
  mutation CreateTenant($input: TenantInput!) {
    createTenant(input: $input) {
      code
      success
      message
      tenant_id
      tenant {
        tenant_id
        first_name
        family_name
        name
        email
        phone
        date_of_birth
        id_number
        emergency_contact_name
        emergency_contact_phone
        guarantor_first_name
        guarantor_family_name
        guarantor_relationship
        guarantor_phone
        guarantor_email
        guarantor_address
        notes
        id_attachment
        phone_verified
        audit {
          created_by
          created_date
        }
      }
    }
  }
`;

export const UPDATE_TENANT = gql`
  mutation UpdateTenant($tenant_id: NonEmptyString!, $input: TenantInput!) {
    updateTenant(tenant_id: $tenant_id, input: $input) {
      code
      success
      message
      tenant {
        tenant_id
        first_name
        family_name
        name
        email
        phone
        date_of_birth
        id_number
        emergency_contact_name
        emergency_contact_phone
        guarantor_first_name
        guarantor_family_name
        guarantor_relationship
        guarantor_phone
        guarantor_email
        guarantor_address
        notes
        id_attachment
        phone_verified
        audit {
          modified_by
          modified_date
        }
      }
    }
  }
`;

export const DELETE_TENANT = gql`
  mutation DeleteTenant($tenant_id: NonEmptyString!) {
    deleteTenant(tenant_id: $tenant_id) {
      code
      success
      message
    }
  }
`;

export const TOGGLE_PHONE_VERIFICATION = gql`
  mutation TogglePhoneVerification($tenant_id: NonEmptyString!) {
    togglePhoneVerification(tenant_id: $tenant_id) {
      code
      success
      message
      phone_verified
    }
  }
`;


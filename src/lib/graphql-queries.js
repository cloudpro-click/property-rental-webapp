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


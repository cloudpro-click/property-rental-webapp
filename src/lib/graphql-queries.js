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
      regions {
        code
        name
        psgc_code
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
      provinces {
        psgc_code
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
      cities {
        psgc_code
        name
      }
    }
  }
`;

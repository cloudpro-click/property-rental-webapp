# GraphQL API Schema Documentation

**API Endpoint**: https://pr-api-dev.cloudpro.work/graphql

## Schema Overview

The GraphQL API currently provides location-based queries for Philippine regions, provinces, and cities. The API has **NO mutations** yet, only queries.

### Key Information
- **Query Type**: Query
- **Mutation Type**: None (read-only API)
- **Subscription Type**: None

## Available Queries

### 1. `ping`
Health check query to test API connectivity.

**Returns**: `JSON`

**Example**:
```graphql
query {
  ping
}
```

---

### 2. `getAllRegions`
Fetches all regions in the Philippines.

**Returns**: `GetAllRegionsResponse`

**Example**:
```graphql
query {
  getAllRegions {
    regions {
      id
      name
      code
      # ... other fields
    }
  }
}
```

**Response Type Structure**:
```
GetAllRegionsResponse {
  regions: [Region]
}

Region {
  id
  name
  code
  # Additional fields TBD
}
```

---

### 3. `getProvincesByRegion`
Fetches all provinces within a specific region.

**Arguments**: Region ID or code (needs investigation)

**Returns**: `GetProvincesByRegionResponse`

**Example**:
```graphql
query GetProvincesByRegion($regionId: ID!) {
  getProvincesByRegion(regionId: $regionId) {
    provinces {
      id
      name
      code
      regionId
      # ... other fields
    }
  }
}
```

**Response Type Structure**:
```
GetProvincesByRegionResponse {
  provinces: [Province]
}

Province {
  id
  name
  code
  regionId
  # Additional fields TBD
}
```

---

### 4. `getCitiesByProvince`
Fetches all cities/municipalities within a specific province.

**Arguments**: Province ID or code (needs investigation)

**Returns**: `GetCitiesByProvinceResponse`

**Example**:
```graphql
query GetCitiesByProvince($provinceId: ID!) {
  getCitiesByProvince(provinceId: $provinceId) {
    cities {
      id
      name
      code
      provinceId
      # ... other fields
    }
  }
}
```

**Response Type Structure**:
```
GetCitiesByProvinceResponse {
  cities: [City]
}

City {
  id
  name
  code
  provinceId
  # Additional fields TBD
}
```

---

## Common Types

### `UserAudit`
Tracking object for create/update information.

```graphql
type UserAudit {
  created_by: String
  created_date: DateTime
  modified_by: String
  modified_date: DateTime
}
```

### `PageInput`
Pagination input for queries that support paging.

```graphql
input PageInput {
  limit: Int! = 1    # Min: 1, Max: 100
  offset: Int! = 0   # Min: 0, Max: 500
}
```

### `FileInput`
Input type for file uploads.

```graphql
input FileInput {
  file_name: String
  # ... other fields
}
```

### `AttachmentInput`
Input type for attachments.

```graphql
input AttachmentInput {
  # Fields TBD
}
```

### `IMutationResponse`
Interface for mutation responses (not used yet since no mutations exist).

```graphql
interface IMutationResponse {
  # Fields TBD
}
```

### `MutationResponse`
Standard mutation response type.

```graphql
type MutationResponse implements IMutationResponse {
  # Fields TBD
}
```

---

## Custom Scalar Types

The API includes many custom scalar types from `graphql-scalars` library:

- **Date/Time**: `DateTime`, `DateTimeISO`, `Date`, `Time`, `Timestamp`, `LocalDate`, `LocalDateTime`, `LocalTime`, `Duration`
- **Geographic**: `Latitude`, `Longitude`, `PostalCode`, `CountryCode`, `CountryName`
- **Identifiers**: `UUID`, `GUID`, `Cuid`, `Cuid2`, `ObjectID`, `ULID`
- **Internet**: `EmailAddress`, `URL`, `IP`, `IPv4`, `IPv6`, `MAC`, `PhoneNumber`
- **Financial**: `Currency`, `USCurrency`, `IBAN`, `AccountNumber`, `RoutingNumber`
- **Numeric**: `BigInt`, `SafeInt`, `PositiveInt`, `NonNegativeInt`, `NegativeInt`, `NonPositiveInt`, `PositiveFloat`, `NonNegativeFloat`, `NegativeFloat`, `NonPositiveFloat`, `UnsignedInt`, `UnsignedFloat`
- **Format**: `JSON`, `JSONObject`, `JWT`, `HexColorCode`, `HSL`, `HSLA`, `RGB`, `RGBA`, `Hexadecimal`
- **Other**: `NonEmptyString`, `Port`, `TimeZone`, `Locale`, `SemVer`, `ISBN`, `GeoJSON`, `Byte`, `Void`

---

## Usage Examples

### Complete Query Example

```javascript
import { useQuery, gql } from '@apollo/client';

const GET_ALL_REGIONS = gql`
  query GetAllRegions {
    getAllRegions {
      regions {
        id
        name
        code
      }
    }
  }
`;

function RegionsList() {
  const { loading, error, data } = useQuery(GET_ALL_REGIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.getAllRegions.regions.map(region => (
        <li key={region.id}>{region.name}</li>
      ))}
    </ul>
  );
}
```

### Cascading Location Query Example

```javascript
import { useQuery, gql } from '@apollo/client';

const GET_PROVINCES_BY_REGION = gql`
  query GetProvincesByRegion($regionId: ID!) {
    getProvincesByRegion(regionId: $regionId) {
      provinces {
        id
        name
        code
      }
    }
  }
`;

function ProvincesList({ regionId }) {
  const { loading, error, data } = useQuery(GET_PROVINCES_BY_REGION, {
    variables: { regionId },
    skip: !regionId // Don't execute if no regionId
  });

  if (!regionId) return null;
  if (loading) return <p>Loading provinces...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <select>
      {data.getProvincesByRegion.provinces.map(province => (
        <option key={province.id} value={province.id}>
          {province.name}
        </option>
      ))}
    </select>
  );
}
```

---

## Current Limitations

1. **Read-Only API**: No mutations available yet - cannot create, update, or delete data
2. **Limited Scope**: Only location queries (regions, provinces, cities) are available
3. **No Property Management**: Building, room, tenant, and billing functionality not yet in API
4. **No Authentication Queries**: Login, register, user management not available

## Integration Notes

Since the API currently only provides location data:

1. **Use for**: Region/Province/City dropdowns in your Building and Tenant forms
2. **Mock Data**: Continue using local state for Buildings, Rooms, Tenants, and Billing until API is extended
3. **Preparation**: Apollo Client is ready - when API adds mutations, you can easily integrate them

## Next Steps

When the API team adds more functionality, expect:
- Property management mutations and queries
- User authentication and authorization
- Tenant management
- Billing and payment processing
- File upload capabilities
- Real-time subscriptions

---

**Generated**: 2025-12-29
**API Version**: Apollo Server 5.2.0

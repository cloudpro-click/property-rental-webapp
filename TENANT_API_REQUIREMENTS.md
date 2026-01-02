# Tenant Creation API Requirements

## Overview
This document outlines the requirements for the Tenant GraphQL API to support the property rental web application's tenant management features.

---

## 1. Tenant Data Model

### Required Fields
```javascript
{
  tenant_id: 'ULID',                    // Auto-generated unique identifier
  first_name: String! (required),       // Tenant's first name
  last_name: String! (required),        // Tenant's last name
  email: Email! (required),             // Unique email address
  phone: PhoneNumber! (required),       // Unique phone number with country code (e.g., "+639171234567")
  date_of_birth: DateTime,              // Date of birth
  id_number: String,                    // Government ID number

  // Emergency Contact
  emergency_contact_name: String,       // Emergency contact person's name
  emergency_contact_phone: PhoneNumber, // Emergency contact phone number

  // Guardian/Guarantor Information
  guarantor_name: String,               // Full name of guarantor
  guarantor_relationship: String,       // Relationship to tenant (Parent, Sibling, Spouse, etc.)
  guarantor_phone: PhoneNumber,         // Guarantor's phone number
  guarantor_email: Email,               // Guarantor's email address
  guarantor_occupation: String,         // Guarantor's occupation
  guarantor_company: String,            // Guarantor's company
  guarantor_address: String,            // Guarantor's complete address

  // Additional Information
  notes: String,                        // Additional notes about the tenant
  id_attachment: String,                // URL to government ID image (S3 or similar)
  phone_verified: Boolean,              // Phone verification status (default: false)

  // Audit Fields
  created_by: String,                   // User who created the record
  created_at: DateTime,                 // Creation timestamp
  updated_by: String,                   // User who last updated the record
  updated_at: DateTime,                 // Last update timestamp
  deleted: Boolean,                     // Soft delete flag (default: false)
  deleted_by: String,                   // User who deleted the record
  deleted_at: DateTime                  // Deletion timestamp
}
```

### DynamoDB Structure (Recommended)
```javascript
{
  pk: 'tenant',
  sk: '${tenant_id}',
  // ... all fields above

  // GSI for email lookup
  gsi1_pk: 'tenant#email',
  gsi1_sk: '${email}',

  // GSI for phone lookup
  gsi2_pk: 'tenant#phone',
  gsi2_sk: '${phone}'
}
```

---

## 2. GraphQL Schema

### Types
```graphql
type Tenant {
  tenant_id: String!
  first_name: String!
  last_name: String!
  name: String!  # Computed field: "${first_name} ${last_name}"
  email: String!
  phone: String!
  date_of_birth: DateTime
  id_number: String
  emergency_contact_name: String
  emergency_contact_phone: String
  guarantor_name: String
  guarantor_relationship: String
  guarantor_phone: String
  guarantor_email: String
  guarantor_occupation: String
  guarantor_company: String
  guarantor_address: String
  notes: String
  id_attachment: String
  phone_verified: Boolean
  audit: UserAudit
}

type UserAudit {
  created_by: String
  created_at: DateTime
  updated_by: String
  updated_at: DateTime
  deleted_by: String
  deleted_at: DateTime
}

# Custom Scalars (if not already defined)
scalar DateTime
scalar Email
scalar PhoneNumber
scalar NonEmptyString
```

### Input Types
```graphql
input TenantInput {
  first_name: NonEmptyString!
  last_name: NonEmptyString!
  email: Email!
  phone: PhoneNumber!
  date_of_birth: DateTime
  id_number: String
  emergency_contact_name: String
  emergency_contact_phone: PhoneNumber
  guarantor_name: String
  guarantor_relationship: String
  guarantor_phone: PhoneNumber
  guarantor_email: Email
  guarantor_occupation: String
  guarantor_company: String
  guarantor_address: String
  notes: String
  id_attachment: String
  phone_verified: Boolean
}

input PageInput {
  limit: Int
  offset: Int
}
```

### Queries
```graphql
extend type Query {
  # Get single tenant by ID
  getTenant(tenant_id: NonEmptyString!): GetTenantResponse

  # Search tenants by name, email, or phone
  searchTenant(search_string: NonEmptyString!): SearchTenantResponse

  # Get all tenants with pagination
  getAllTenants(page: PageInput): GetAllTenantsResponse

  # Check if email is unique (for validation)
  checkEmailUniqueness(email: Email!, exclude_tenant_id: String): EmailUniquenessResponse

  # Check if phone is unique (for validation)
  checkPhoneUniqueness(phone: PhoneNumber!, exclude_tenant_id: String): PhoneUniquenessResponse
}
```

### Mutations
```graphql
extend type Mutation {
  # Create a new tenant
  createTenant(input: TenantInput!): CreateTenantResponse

  # Update existing tenant
  updateTenant(tenant_id: NonEmptyString!, input: TenantInput!): UpdateTenantResponse

  # Soft delete tenant
  deleteTenant(tenant_id: NonEmptyString!): DeleteTenantResponse

  # Toggle phone verification status
  togglePhoneVerification(tenant_id: NonEmptyString!): TogglePhoneVerificationResponse
}
```

### Response Types
```graphql
type GetTenantResponse {
  code: String!
  success: Boolean!
  message: String!
  tenant: Tenant
}

type SearchTenantResponse {
  code: String!
  success: Boolean!
  message: String!
  tenants: [Tenant!]
}

type GetAllTenantsResponse {
  code: String!
  success: Boolean!
  message: String!
  tenants: [Tenant!]
  total_count: Int
  has_more: Boolean
}

type CreateTenantResponse {
  code: String!
  success: Boolean!
  message: String!
  tenant_id: String
  tenant: Tenant
}

type UpdateTenantResponse {
  code: String!
  success: Boolean!
  message: String!
  tenant: Tenant
}

type DeleteTenantResponse {
  code: String!
  success: Boolean!
  message: String!
}

type EmailUniquenessResponse {
  code: String!
  success: Boolean!
  message: String!
  is_unique: Boolean!
  existing_tenant_id: String
}

type PhoneUniquenessResponse {
  code: String!
  success: Boolean!
  message: String!
  is_unique: Boolean!
  existing_tenant_id: String
}

type TogglePhoneVerificationResponse {
  code: String!
  success: Boolean!
  message: String!
  phone_verified: Boolean!
}
```

---

## 3. Business Rules & Validation

### Uniqueness Constraints
- **Email**: Must be unique across all tenants (case-insensitive)
- **Phone**: Must be unique across all tenants
- When updating a tenant, exclude the current tenant from uniqueness checks

### Required Fields Validation
- `first_name`: Non-empty string, max 100 characters
- `last_name`: Non-empty string, max 100 characters
- `email`: Valid email format
- `phone`: Valid phone number with country code (E.164 format recommended)

### Optional Fields Validation
- `date_of_birth`: Must be a valid date in the past
- `id_number`: Max 50 characters
- `guarantor_email`: Valid email format if provided
- `guarantor_phone`: Valid phone number if provided
- `notes`: Max 1000 characters

### Phone Number Format
- **Expected format**: `+[country_code][number]`
- **Example**: `+639171234567` (Philippines)
- **Frontend sends**: Full number with country code
- **Backend stores**: Full number with country code
- **Display**: Format as needed (e.g., "+63 917 123 4567")

### Image Upload (ID Attachment)
- **Accepted formats**: PNG, JPG, GIF (no PDFs)
- **Max file size**: 5MB
- **Storage**: S3 or similar cloud storage
- **Field value**: URL to the stored image
- **Frontend handles**: File upload to S3, sends URL to API

---

## 4. Expected API Behavior

### Create Tenant
**Input**:
```graphql
mutation CreateTenant($input: TenantInput!) {
  createTenant(input: $input) {
    code
    success
    message
    tenant_id
    tenant {
      tenant_id
      name
      email
      phone
      phone_verified
    }
  }
}
```

**Variables**:
```json
{
  "input": {
    "first_name": "Juan",
    "last_name": "Dela Cruz",
    "email": "juan.delacruz@email.com",
    "phone": "+639171234567",
    "date_of_birth": "1990-05-15T00:00:00.000Z",
    "id_number": "123456789",
    "emergency_contact_name": "Maria Dela Cruz",
    "emergency_contact_phone": "+639189876543",
    "guarantor_name": "Pedro Dela Cruz",
    "guarantor_relationship": "Parent",
    "guarantor_phone": "+639171112222",
    "guarantor_email": "pedro.delacruz@email.com",
    "guarantor_occupation": "Business Owner",
    "guarantor_company": "ABC Company",
    "guarantor_address": "123 Main St, Manila, Philippines",
    "notes": "Prefers ground floor units",
    "id_attachment": "https://s3.amazonaws.com/bucket/tenant-ids/123456.jpg",
    "phone_verified": false
  }
}
```

**Expected Response** (Success):
```json
{
  "data": {
    "createTenant": {
      "code": "200",
      "success": true,
      "message": "Tenant created successfully",
      "tenant_id": "01J9XXXXXXXXXXXXXXXXXXX",
      "tenant": {
        "tenant_id": "01J9XXXXXXXXXXXXXXXXXXX",
        "name": "Juan Dela Cruz",
        "email": "juan.delacruz@email.com",
        "phone": "+639171234567",
        "phone_verified": false
      }
    }
  }
}
```

**Expected Response** (Email Already Exists):
```json
{
  "data": {
    "createTenant": {
      "code": "400",
      "success": false,
      "message": "Email already registered to another tenant",
      "tenant_id": null,
      "tenant": null
    }
  }
}
```

**Expected Response** (Phone Already Exists):
```json
{
  "data": {
    "createTenant": {
      "code": "400",
      "success": false,
      "message": "Phone number already registered to another tenant",
      "tenant_id": null,
      "tenant": null
    }
  }
}
```

### Update Tenant
**Input**:
```graphql
mutation UpdateTenant($tenant_id: NonEmptyString!, $input: TenantInput!) {
  updateTenant(tenant_id: $tenant_id, input: $input) {
    code
    success
    message
    tenant {
      tenant_id
      name
      email
      phone
    }
  }
}
```

**Behavior**:
- When checking email/phone uniqueness, exclude the current `tenant_id`
- Update `updated_by` and `updated_at` fields
- Return updated tenant object

### Check Phone Uniqueness (Real-time Validation)
**Input**:
```graphql
query CheckPhoneUniqueness($phone: PhoneNumber!, $exclude_tenant_id: String) {
  checkPhoneUniqueness(phone: $phone, exclude_tenant_id: $exclude_tenant_id) {
    code
    success
    message
    is_unique
    existing_tenant_id
  }
}
```

**Use Case**:
- Frontend calls this as user types phone number
- When editing, pass `exclude_tenant_id` to exclude current tenant from check
- Debounced on frontend (500ms delay)

**Expected Response** (Unique):
```json
{
  "data": {
    "checkPhoneUniqueness": {
      "code": "200",
      "success": true,
      "message": "Phone number is available",
      "is_unique": true,
      "existing_tenant_id": null
    }
  }
}
```

**Expected Response** (Taken):
```json
{
  "data": {
    "checkPhoneUniqueness": {
      "code": "200",
      "success": true,
      "message": "Phone number already registered",
      "is_unique": false,
      "existing_tenant_id": "01J9XXXXXXXXXXXXXXXXXXX"
    }
  }
}
```

### Get All Tenants (with Pagination)
**Input**:
```graphql
query GetAllTenants($page: PageInput) {
  getAllTenants(page: $page) {
    code
    success
    message
    tenants {
      tenant_id
      first_name
      last_name
      name
      email
      phone
      phone_verified
      date_of_birth
      id_number
      emergency_contact_name
      emergency_contact_phone
      guarantor_name
      guarantor_relationship
      guarantor_phone
      guarantor_email
      notes
      id_attachment
      audit {
        created_at
        updated_at
      }
    }
    total_count
    has_more
  }
}
```

**Variables**:
```json
{
  "page": {
    "limit": 50,
    "offset": 0
  }
}
```

**Behavior**:
- Return only non-deleted tenants (deleted: false)
- Sort by `created_at` DESC (newest first)
- Support pagination with limit/offset

### Search Tenant
**Input**:
```graphql
query SearchTenant($search_string: NonEmptyString!) {
  searchTenant(search_string: $search_string) {
    code
    success
    message
    tenants {
      tenant_id
      name
      email
      phone
    }
  }
}
```

**Behavior**:
- Search across: `first_name`, `last_name`, `email`, `phone`
- Case-insensitive partial match
- Return only non-deleted tenants
- Limit results to 20 for performance

---

## 5. Frontend Integration

### Current Implementation
The frontend has a 3-step wizard:
1. **Step 1**: Tenant Information (name, email, phone, DOB, ID number, emergency contact)
2. **Step 2**: Guardian Details (guarantor information)
3. **Step 3**: Additional Information (notes, ID attachment)

### Phone Input Component
- Uses custom `PhoneInput` component
- Displays country code dropdown (default: +63)
- Separate input for phone number
- Real-time uniqueness validation with visual indicators:
  - ✓ Green checkmark: "Available"
  - ✗ Red X: "Taken - This phone number is already registered to another tenant"
- Validation excludes current tenant when editing

### File Upload (ID Attachment)
- Accepts only images: PNG, JPG, GIF
- Max file size: 5MB
- Frontend uploads to S3, sends URL to API
- Displays preview before upload

### Validation Rules
- Required fields: `first_name`, `last_name`, `email`, `phone`
- Email format validation
- Phone uniqueness check (real-time)
- "Next" button disabled if required fields missing or phone is taken
- "Register/Update" button disabled if phone is taken

---

## 6. Error Handling

### Expected Error Scenarios
1. **Duplicate Email**: Return `success: false` with message "Email already registered to another tenant"
2. **Duplicate Phone**: Return `success: false` with message "Phone number already registered to another tenant"
3. **Invalid Email Format**: Return validation error
4. **Invalid Phone Format**: Return validation error
5. **Missing Required Fields**: Return validation error listing missing fields
6. **Tenant Not Found** (Update/Delete): Return `success: false` with message "Tenant not found"

### Error Response Format
```json
{
  "data": {
    "createTenant": {
      "code": "400",
      "success": false,
      "message": "Validation error: [specific error message]",
      "tenant_id": null,
      "tenant": null
    }
  }
}
```

---

## 7. Authentication & Authorization

### Expected Behavior
- All mutations require authenticated user
- `created_by` and `updated_by` should be set from authenticated user context
- Pass user information via GraphQL context

### Example Context
```javascript
{
  user: {
    user_id: 'user_123',
    email: 'admin@example.com',
    name: 'Admin User'
  }
}
```

---

## 8. Future Enhancements (Not Required Now)

These features are planned for future implementation but **NOT required** for initial tenant creation:

1. **Lease Management**: Linking tenants to rooms via leases
2. **Multi-Tenant Rooms**: Support for roommates (primary + secondary tenants)
3. **Tenant History**: Track all leases and rooms for a tenant
4. **Payment Tracking**: Link tenants to payment records
5. **Document Management**: Multiple document uploads per tenant

---

## 9. Testing Checklist

Please ensure the following scenarios are tested:

- [ ] Create tenant with all required fields
- [ ] Create tenant with all optional fields
- [ ] Create tenant with duplicate email (should fail)
- [ ] Create tenant with duplicate phone (should fail)
- [ ] Update tenant information
- [ ] Update tenant phone to another tenant's phone (should fail)
- [ ] Update tenant phone to same phone (should succeed)
- [ ] Check phone uniqueness for new phone
- [ ] Check phone uniqueness excluding current tenant
- [ ] Get all tenants with pagination
- [ ] Search tenant by name
- [ ] Search tenant by email
- [ ] Search tenant by phone
- [ ] Soft delete tenant
- [ ] Get deleted tenant (should not appear in getAllTenants)
- [ ] Toggle phone verification status

---

## 10. Priority & Timeline

### Phase 1 (Required Now)
- Create Tenant mutation
- Update Tenant mutation
- Get All Tenants query
- Check Phone Uniqueness query
- Check Email Uniqueness query (optional but recommended)

### Phase 2 (Future)
- Search functionality
- Delete tenant mutation
- Get single tenant query
- Toggle phone verification

---

## Questions or Clarifications?

If you need any clarification on these requirements, please reach out. The frontend is ready to integrate once the API endpoints are available.

**Frontend Repository**: property-rental-webapp
**API Repository**: property-rental-api
**Communication**: Please update me once the API is ready for testing.

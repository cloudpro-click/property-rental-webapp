# Tenant Fields - Simple Reference

## Required Fields - Tenant Information (Step 1)

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| `first_name` | String | Tenant's first name | "Juan" |
| `last_name` | String | Tenant's last name | "Dela Cruz" |
| `email` | Email | Email address (must be unique) | "juan.delacruz@email.com" |
| `phone` | Phone | Phone with country code (must be unique) | "+639171234567" |

---

## Required Fields - Guardian Details (Step 2)

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| `guarantor_first_name` | String | Guardian's first name | "Pedro" |
| `guarantor_last_name` | String | Guardian's family/last name | "Dela Cruz" |
| `guarantor_name` | String | Full name (auto-generated from first + last) | "Pedro Dela Cruz" |
| `guarantor_relationship` | String | Relationship to tenant | "Parent" |
| `guarantor_phone` | Phone | Guarantor's phone | "+639171112222" |

---

## Optional Fields - Personal Information

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| `date_of_birth` | Date | Date of birth | "1990-05-15" |
| `id_number` | String | Government ID number | "123456789" |
| `notes` | Text | Additional notes about tenant | "Prefers ground floor units" |
| `id_attachment` | URL | Link to uploaded ID image | "https://s3.../tenant-id.jpg" |
| `phone_verified` | Boolean | Phone verification status | true/false |

---

## Optional Fields - Emergency Contact

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| `emergency_contact_name` | String | Emergency contact person name | "Maria Dela Cruz" |
| `emergency_contact_phone` | Phone | Emergency contact phone | "+639189876543" |

---

## Optional Fields - Guardian/Guarantor (Additional Info)

| Field Name | Type | Description | Example |
|------------|------|-------------|---------|
| `guarantor_email` | Email | Guarantor's email | "pedro.delacruz@email.com" |
| `guarantor_occupation` | String | Guarantor's job | "Business Owner" |
| `guarantor_company` | String | Guarantor's company | "ABC Company" |
| `guarantor_address` | Text | Guarantor's complete address | "123 Main St, Manila, Philippines" |

---

## Auto-Generated Fields (System)

| Field Name | Type | Description |
|------------|------|-------------|
| `tenant_id` | ULID | Unique identifier (auto-generated) |
| `created_by` | String | User who created the record |
| `created_at` | DateTime | Creation timestamp |
| `updated_by` | String | User who last updated |
| `updated_at` | DateTime | Last update timestamp |
| `deleted` | Boolean | Soft delete flag |
| `deleted_by` | String | User who deleted |
| `deleted_at` | DateTime | Deletion timestamp |

---

## Validation Rules

### Email
- Must be valid email format
- Must be unique (no duplicates)
- Case-insensitive check

### Phone
- Format: `+[country_code][number]`
- Example: `+639171234567` (Philippines)
- Must be unique (no duplicates)
- Validate on every keystroke (real-time)

### Relationship Options
- Parent
- Sibling
- Spouse
- Relative
- Friend
- Employer
- Colleague
- Other

### ID Attachment
- Only images allowed: PNG, JPG, GIF
- Maximum file size: 5MB
- No PDFs

---

## Complete Example

```json
{
  "first_name": "Juan",
  "last_name": "Dela Cruz",
  "email": "juan.delacruz@email.com",
  "phone": "+639171234567",
  "date_of_birth": "1990-05-15",
  "id_number": "123456789",
  "emergency_contact_name": "Maria Dela Cruz",
  "emergency_contact_phone": "+639189876543",
  "guarantor_first_name": "Pedro",
  "guarantor_last_name": "Dela Cruz",
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
```

---

## Minimal Example (Only Required Fields)

```json
{
  "first_name": "Juan",
  "last_name": "Dela Cruz",
  "email": "juan.delacruz@email.com",
  "phone": "+639171234567",
  "guarantor_first_name": "Pedro",
  "guarantor_last_name": "Dela Cruz",
  "guarantor_name": "Pedro Dela Cruz",
  "guarantor_relationship": "Parent",
  "guarantor_phone": "+639171112222"
}
```

---

## Phone Format Details

### Input Format
- Country Code Dropdown: `+63` (Philippines)
- Number Field: `917 123 4567`

### Stored Format
- Combined: `+639171234567`

### Display Format
- `+63 917 123 4567` (with spaces for readability)

---

## Important Notes

1. **Email & Phone Must Be Unique**
   - Check uniqueness before saving
   - When editing, exclude current tenant from check

2. **All Guardian Fields Are Optional**
   - Can save tenant without guardian info

3. **Phone Verification**
   - Default: `false`
   - Can be toggled manually in the system

4. **ID Attachment**
   - Upload image to S3 first
   - Send the URL to API
   - Do not send file directly to API

5. **Soft Delete**
   - Tenants are not physically deleted
   - Just marked as deleted (deleted: true)
   - Can be restored later

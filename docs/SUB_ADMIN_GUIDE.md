# Sub-Admin Role Implementation Guide

## Overview

The sub-admin role provides a middle-tier administrative access level between regular customers and full administrators. Sub-admins have permission-based access to specific pages and functionalities.

## Features

### 1. Permission-Based Access Control
- Sub-admins can only access pages they have been granted permissions for
- Available permissions:
  - `dashboard` - Access to sub-admin dashboard (always available)
  - `orders` - Orders management page
  - `products` - Products management page
  - `delivery` - Delivery management page
  - `profile` - Profile page (always available)

### 2. Dynamic Tab Navigation
- Tab bar only shows tabs for pages the sub-admin has permission to access
- Dashboard and Profile tabs are always visible
- Other tabs appear/disappear based on permissions

### 3. Route Protection
- Each protected page checks for specific permissions
- Unauthorized access redirects to dashboard
- Role-based routing ensures proper navigation

## File Structure

```
app/
├── sub-admin/
│   ├── _layout.tsx              # Tab layout with permission-based visibility
│   ├── index.tsx                # Redirect to dashboard
│   ├── subadmindashboard.tsx    # Main dashboard (always accessible)
│   ├── subadminorders.tsx       # Orders management (requires 'orders' permission)
│   ├── subadminproducts.tsx     # Products management (requires 'products' permission)
│   ├── subadmindelivery.tsx     # Delivery management (requires 'delivery' permission)
│   └── subadminprofile.tsx      # Profile page (always accessible)
│
├── admin/
│   └── adminsubadminmanagement.tsx  # Admin interface to manage sub-admin permissions
│
core/
├── auth/
│   └── SubAdminProtectedRoute.tsx   # Route protection component
│
├── services/
│   └── subAdminService.ts           # Sub-admin management service
│
└── session/
    └── sessionManager.ts            # Updated to include permissions
```

## Usage

### 1. Creating Sub-Admin Users

Sub-admin users can be created through the admin panel or programmatically:

```typescript
import { subAdminService } from '../core/services/subAdminService';

// Create a new sub-admin
await subAdminService.createSubAdmin({
  uid: 'user-id',
  email: 'subadmin@example.com',
  displayName: 'Sub Admin Name',
}, ['dashboard', 'orders', 'products']);
```

### 2. Managing Permissions

Admins can manage sub-admin permissions through the admin panel:

1. Navigate to Admin → Sub-Admin tab
2. Select a sub-admin user
3. Click "Edit" to modify permissions
4. Check/uncheck desired permissions
5. Save changes

### 3. Permission Checking

In components, check permissions using:

```typescript
import { useAuth } from '../core/auth/AuthContext';

const { userSession } = useAuth();

const hasOrdersPermission = userSession?.permissions?.includes('orders');
```

### 4. Protected Routes

Use the SubAdminProtectedRoute component:

```typescript
import { SubAdminProtectedRoute } from '../core/auth/SubAdminProtectedRoute';

<SubAdminProtectedRoute requiredPermission="orders">
  <OrdersComponent />
</SubAdminProtectedRoute>
```

## Available Permissions

| Permission | Description | Page Access |
|------------|-------------|-------------|
| `dashboard` | Dashboard access | Always granted |
| `orders` | Orders management | `/sub-admin/subadminorders` |
| `products` | Products management | `/sub-admin/subadminproducts` |
| `delivery` | Delivery management | `/sub-admin/subadmindelivery` |
| `profile` | Profile access | Always granted |

## Database Schema

### User Document (Firestore)

```typescript
interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: 'customer' | 'admin' | 'delivery' | 'sub-admin';
  permissions?: string[];  // Array of permission strings
  phoneNumber?: string;
  createdAt: number;
  updatedAt: number;
}
```

### Session Data

```typescript
interface UserSession {
  uid: string;
  email: string;
  displayName?: string;
  role?: string;
  permissions?: string[];  // Included in session for quick access
  sessionToken: string;
  loginTime: number;
  expiresAt?: number;
}
```

## Testing

### 1. Create Test Sub-Admin

Use the provided script to create a test sub-admin user:

```bash
node scripts/createTestSubAdmin.js
```

### 2. Test Scenarios

1. **Login as sub-admin** - Should redirect to sub-admin dashboard
2. **Permission-based navigation** - Only permitted tabs should be visible
3. **Direct URL access** - Accessing unpermitted pages should redirect to dashboard
4. **Permission updates** - Changes in admin panel should reflect immediately

### 3. Test User Credentials

After running the test script:
- Email: `subadmin@test.com`
- Password: `testpassword123`
- Default permissions: `['dashboard', 'orders', 'products']`

## Security Considerations

1. **Server-side validation** - Always validate permissions on the backend
2. **Session management** - Permissions are cached in session for performance
3. **Route protection** - All sensitive routes are protected with permission checks
4. **Role hierarchy** - Sub-admins cannot access full admin features

## Customization

### Adding New Permissions

1. Add to `AVAILABLE_PERMISSIONS` in `subAdminService.ts`
2. Create corresponding page component
3. Add tab to `_layout.tsx` with permission check
4. Update permission display names in service

### Custom Permission Logic

Extend the `subAdminService` to implement custom permission logic:

```typescript
// Custom permission validation
hasCustomPermission(userPermissions: string[], customLogic: () => boolean): boolean {
  return this.hasPermission(userPermissions, 'base-permission') && customLogic();
}
```

## Troubleshooting

### Common Issues

1. **Tabs not showing** - Check if permissions are properly set in Firestore
2. **Redirect loops** - Ensure dashboard permission is always granted
3. **Permission updates not reflecting** - Clear app cache or restart app
4. **Route protection not working** - Verify SubAdminProtectedRoute is properly wrapped

### Debug Tips

1. Check user session in React DevTools
2. Verify Firestore user document has correct permissions array
3. Check console for authentication errors
4. Test with different permission combinations

## Future Enhancements

1. **Granular permissions** - More specific permissions (e.g., 'orders.read', 'orders.write')
2. **Time-based permissions** - Permissions that expire after certain time
3. **Location-based permissions** - Permissions based on user location
4. **Audit logging** - Track permission changes and access attempts
5. **Bulk permission management** - Manage permissions for multiple sub-admins at once
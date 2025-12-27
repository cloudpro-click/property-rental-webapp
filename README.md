# RentManager - Property Rental Management System

A comprehensive property rental management system built with React and Tailwind CSS, designed specifically for managing rental properties in the Philippines.

## 🇵🇭 Philippine Theme

The application features a color scheme inspired by the Philippine flag:
- **Primary Blue** (#0038a8) - Navigation and primary actions
- **Secondary Red** (#ce1126) - Alerts and important actions
- **Accent Yellow** (#fcd116) - Highlights and success states
- **White & Neutral** - Clean, modern backgrounds

## ✨ Features

### 🔐 Authentication System
- User login and registration
- Protected routes with authentication guard
- Session persistence using localStorage

### 📊 Dashboard
- Overview of all properties and statistics
- Total buildings, rooms, tenants, and revenue
- Recent payments tracking
- Upcoming dues monitoring
- Quick action buttons for common tasks

### 🏢 Buildings Management
- Add, view, and manage buildings
- Track occupancy rates per building
- Monitor monthly revenue by building
- View room distribution

### 🚪 Rooms/Units Management
- Add and manage individual rooms/units
- **Electric meter number tracking** for each room
- Room details: number, floor, rent amount
- Vacancy status tracking
- Filter by building

### 👥 Tenants Management
- Complete tenant information management
- Contact details (email, phone)
- Move-in dates and rental history
- Balance tracking
- Active/inactive status

### 💰 Rent Collection
- Payment tracking and collection
- Multiple payment methods (Cash, Bank Transfer, GCash, PayMaya)
- Payment status (Paid, Pending, Overdue)
- Collection statistics and metrics
- Payment history

### 📈 Reports & Analytics
- Revenue trend analysis
- Building performance comparison
- Payment analysis with visual charts
- Occupancy rate tracking
- Top tenants by payment history
- Export capabilities

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd property-rental-webapp
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3003
```

### Default Login
For demo purposes, you can use any email and password to log in. The authentication is currently using mock data stored in localStorage.

## 🛠️ Tech Stack

- **React 19** - UI framework
- **React Router DOM** - Navigation and routing
- **Tailwind CSS v3** - Styling framework
- **Vite** - Build tool and dev server
- **Context API** - State management

## 📱 Responsive Design

The application is fully responsive with breakpoints for:
- **Mobile**: < 768px
- **Tablet**: ≥ 768px
- **Desktop**: ≥ 1024px

## 🎨 Custom Theme Configuration

Theme colors are configured in [tailwind.config.js](tailwind.config.js):

```js
primary: Philippine Blue (#0038a8)
secondary: Philippine Red (#ce1126)
accent: Philippine Sun Yellow (#fcd116)
neutral: Grayscale palette
```

Custom component classes in [src/index.css](src/index.css):
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.card` - Card containers with shadows
- `.input-field` - Styled input fields

## 📂 Project Structure

```
src/
├── components/
│   ├── DashboardLayout.jsx    # Main dashboard layout with sidebar
│   ├── Navbar.jsx             # (Legacy) Public navbar
│   ├── Hero.jsx               # (Legacy) Landing hero
│   ├── PropertyCard.jsx       # (Legacy) Property card
│   ├── PropertyList.jsx       # (Legacy) Property list
│   └── Footer.jsx             # (Legacy) Footer
├── context/
│   └── AuthContext.jsx        # Authentication context provider
├── pages/
│   ├── Login.jsx              # Login page
│   ├── Register.jsx           # Registration page
│   ├── Dashboard.jsx          # Main dashboard
│   ├── Buildings.jsx          # Buildings management
│   ├── Rooms.jsx              # Rooms/units management
│   ├── Tenants.jsx            # Tenants management
│   ├── RentCollection.jsx    # Rent collection
│   └── Reports.jsx            # Reports & analytics
├── App.jsx                    # Main app with routing
├── index.css                  # Global styles and Tailwind
└── index.jsx                  # App entry point
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Run ESLint

## 🎯 Key Features Implementation

### Electric Meter Tracking
Each room includes an electric meter number field for utility management:
```jsx
{
  electricMeter: 'EM-001-2024',
  // ... other room properties
}
```

### Philippine Peso (₱) Currency
All monetary values are displayed in Philippine Peso with proper formatting:
```jsx
₱8,500
₱285,000
```

### Payment Methods
Support for common Philippine payment methods:
- Cash
- Bank Transfer
- GCash
- PayMaya

## 🔒 Authentication Flow

1. User visits the app → Redirects to `/login`
2. User logs in → Creates session in localStorage
3. User accesses protected routes → AuthContext validates session
4. User logs out → Clears localStorage and redirects to login

## 🎨 Design Principles

- **Mobile-First**: Designed for mobile with progressive enhancement
- **Clean & Modern**: Minimalist design with focus on usability
- **Philippine Identity**: Colors and theme reflect Philippine culture
- **Accessibility**: Proper contrast ratios and semantic HTML

## 📝 Future Enhancements

- Backend API integration
- Database persistence
- Email notifications for due payments
- SMS reminders (Philippine carriers)
- Export reports to PDF/Excel
- Document upload for tenants
- Maintenance request tracking
- Expense management
- Multi-language support (English/Tagalog)
- Dark mode

## 📄 License

This project is private and proprietary.

## 👨‍💻 Development

Built with ❤️ for property owners in the Philippines.

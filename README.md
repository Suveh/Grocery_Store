Grocery Store E-commerce Platform
A modern, full-featured grocery shopping platform built with Next.js 13+ and Strapi headless CMS. Features user authentication, shopping cart, order management, and a responsive design.

> Live Demo
Frontend: [http://localhost:3000](http://localhost:3000)

Strapi Admin: [http://localhost:1337](http://localhost:1337)

> Quick Start
Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL 12+

Git

1. Clone the Repository
bash
git clone https://github.com/your-username/grocery-store.git
cd grocery-store

3. Frontend Setup (Next.js)
bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your configurations
npm run dev
Frontend will run at: http://localhost:3000

3. Backend Setup (Strapi)
bash
cd ../backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run develop
Strapi will run at: http://localhost:1337


Frontend
- Framework: Next.js 13+ with App Router
- Language: TypeScript (optional)
- Styling: Tailwind CSS + shadcn/ui
- State Management: React Context + Local Storage
- HTTP Client: Axios
- Icons: Lucide React
- Notifications: Sonner

Backend
- CMS: Strapi v4
- Database: PostgreSQL
- Authentication: JWT with Strapi Users-Permissions
- File Uploads: Local provider (can be switched to AWS S3/Cloudinary)

Development Tools
- Package Manager: npm/yarn
- Version Control: Git

✨ Features
- Shopping Experience
- Product browsing by categories
- Real-time search functionality
- Shopping cart with persistent storage
- Secure checkout process
- Order history tracking

👤 User Management
- User registration & authentication
- Profile management with avatar upload
- Order tracking

🎨 UI/UX
- Fully responsive design
- Dark/Light mode (optional)
- Toast notifications
- Loading states & skeletons
- Form validation

🛠️ Admin Features
- Strapi admin panel for content management
- Product CRUD operations
- Order management
- User management
- Category management

🗄️ Database Schema
Main Collections
- Users (Strapi built-in with extended fields)
- Products (with categories, images, pricing)
- Categories (hierarchical structure)
- Orders (with order items, payment info)
- UserCarts (shopping cart items)


📈 Future Enhancements
- Payment gateway integration (Stripe/Razorpay)
- Real-time notifications
- Product reviews & ratings
- Wishlist functionality
- Inventory management
- Admin dashboard analytics
- Multi-language support
- PWA capabilities
- Social login (Google/Facebook)
- Email notifications

🙏 Acknowledgments
- Next.js for the amazing React framework
- Strapi for the headless CMS
- shadcn/ui for beautiful components
- Tailwind CSS for utility-first CSS
- All open-source contributors

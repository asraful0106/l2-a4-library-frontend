# Favorite Book

A modern, responsive web application for managing a library system, built with React, TypeScript, and Redux Toolkit. This frontend interacts with a backend API to perform operations such as browsing books, borrowing books, and managing book records.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Folder Structure](#folder-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

## Features
- **Browse Books**: View a list of all available books.
- **Book Details**: Access detailed information about a specific book.
- **Create/Edit Books**: Add new books or update existing book records.
- **Delete Books**: Remove books from the library database.
- **Borrow Books**: Borrow books and track borrowing history.
- **Borrow Summary**: View a summary of all borrowed books.
- **Responsive UI**: Built with Tailwind CSS and Radix UI for a modern, accessible interface.
- **Form Validation**: Powered by `react-hook-form` and `zod` for robust form handling.
- **State Management**: Managed with Redux Toolkit for predictable state updates.
- **Routing**: Implemented with `react-router` for seamless navigation.
- **Animations**: Enhanced with `framer-motion` and `embla-carousel` for smooth UI interactions.
- **Notifications**: Integrated with `react-toastify` and `sweetalert2` for user feedback.

## Tech Stack
- **Frontend Framework**: React 19.1.0
- **Language**: TypeScript 5.8.3
- **State Management**: Redux Toolkit 2.8.2
- **Routing**: React Router 7.6.3
- **API Client**: Redux Toolkit Query
- **Styling**: Tailwind CSS 4.1.11 with `@tailwindcss/vite`
- **Form Handling**: `react-hook-form` 7.60.0, `zod` 3.25.74
- **UI Components**: Radix UI (Dialog, Label, Popover, Select, Slot, Tabs, Tooltip)
- **Animations**: Framer Motion 12.23.0, Embla Carousel 8.6.0
- **Icons**: Lucide React 0.525 Tensei
- **Notifications**: `react-toastify` 11.0.5, `sweetalert2` 11.22.2
- **Date Handling**: `date-fns` 4.1.0, `react-day-picker` 9.8.0
- **Build Tool**: Vite 7.0.0
- **Linting**: ESLint 9.29.0 with React Hooks and Refresh plugins
- **Other Utilities**: `class-variance-authority`, `tailwind-merge`, `react-spinners`

## Installation
To set up the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/a4-library-frontend.git
   cd a4-library-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - The application connects to a backend API at `https://a3-library-management-api-three.vercel.app/`. Ensure the backend is running or update the `baseUrl` in `baseApi.ts` if using a different API endpoint.

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173`.

## Usage
- **Home Page**: Displays a list of all books (`/` or `/books`).
- **View Book**: Access details of a specific book at `/books/:id`.
- **Create Book**: Add a new book at `/create-book`.
- **Edit Book**: Update an existing book at `/edit-book/:id`.
- **Borrow Book**: Borrow a book at `/borrow/:bookId`.
- **Borrow Summary**: View borrowing history and status at `/borrow-summary`.

The application uses a main layout (`MainLayout`) to wrap all pages, ensuring consistent navigation and styling.

## API Integration
The frontend communicates with a backend API using Redux Toolkit Query. The API endpoints are defined in `baseApi.ts` and include:

- **GET /api/books**: Fetch all books.
- **GET /api/books/:id**: Fetch a single book by ID.
- **POST /api/books**: Create a new book.
- **PUT /api/books/:id**: Update an existing book.
- **DELETE /api/books/:id**: Delete a book.
- **GET /api/borrow**: Fetch borrow summary.
- **POST /api/borrow**: Borrow a book.

The API is configured with tag-based cache invalidation to ensure data consistency across the application.

## Folder Structure
```
a4-library-frontend/
├── node_modules/              # Dependency directory (auto-generated)
├── public/                   # Static assets
│   ├── assets/               # Additional static files
│   ├── images/               # Image assets (e.g., book-1.jpg, book-2.jpg, etc.)
│   └── react.svg             # SVG assets
├── src/                      # Source code
│   ├── assets/               # Asset files
│   ├── components/           # Reusable UI components (e.g., badge.tsx, button.tsx)
│   ├── layout/               # Layout components (e.g., MainLayout.tsx)
│   ├── lib/                  # Utility libraries
│   │   ├── TS_utils.ts       # TypeScript utility functions
│   ├── pages/                # Page components
│   │   ├── book/             # Book-related pages (e.g., Book.tsx, BookCarousel.tsx)
│   │   ├── borrow-a-book/    # Borrow book pages (e.g., BorrowABook.tsx)
│   │   ├── borrow-book/      # Additional borrow-related pages
│   │   ├── borrow-summary/   # Borrow summary page (e.g., BorrowSummary.tsx)
│   │   ├── createBook/       # Create book page (e.g., CreateNewBook.tsx)
│   │   ├── Edit a Book/      # Edit book page (e.g., EditABook.tsx)
│   │   ├── view-a-book/      # View book page (e.g., ViewABook.tsx)
│   ├── redux/                # Redux-related files
│   │   ├── api/              # API configuration (e.g., baseApi.ts)
│   │   ├── hook.ts           # Custom hooks
│   │   ├── store.ts          # Redux store configuration
│   │   └── types/            # Type definitions (e.g., IBook.ts, ISummary.ts)
│   ├── router/               # Routing configuration (e.g., index.ts)
│   ├── RotatingText.tsx      # Rotating text component
│   ├── shared/               # Shared components or utilities
│   ├── Footer.tsx            # Footer component
│   ├── Navigation.tsx        # Navigation component
│   ├── index.css             # Global CSS
│   ├── main.tsx              # Entry point
│   └── vite-env.d.ts         # TypeScript environment definitions
├── .gitignore                # Git ignore file
├── bun.lockb                 # Bun lock file
├── components.json           # Component metadata
├── eslint.config.js          # ESLint configuration
├── index.html                # HTML entry point
├── package-lock.json         # Dependency lock file
├── package.json              # Project metadata and scripts
├── README.md                 # Project documentation
├── trace.log                 # Build trace log
├── tsconfig.app.json         # TypeScript configuration for app
├── tsconfig.json             # Main TypeScript configuration
├── tsconfig.node.json        # TypeScript configuration for Node
└── vite.config.ts            # Vite configuration                   
```

## Available Scripts
- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run lint`: Runs ESLint to check for code quality issues.
- `npm run preview`: Previews the production build locally.

## Contributing
Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-feature`).
3. Make your changes and commit (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a pull request.

Ensure your code follows the project's ESLint rules and TypeScript conventions.

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
# KB Freelance Dashboard

A modern React-based time tracking dashboard for freelancers, built with TypeScript and Vite.

## Features

- ⏱️ **Time Tracking**: Start/stop timers for different clients and projects
- 📊 **Daily Summary**: View today's time breakdown and statistics
- 🎨 **Modern UI**: Clean, responsive design with glassmorphism effects
- 🔄 **Real-time Updates**: Live data refresh and timer status
- 📱 **Responsive**: Works on desktop and mobile devices
- 🧪 **Fully Tested**: Comprehensive test suite with 53 passing tests

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Testing**: Vitest + React Testing Library
- **State Management**: React Hooks
- **API**: RESTful API integration

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kb-freelance-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # React components
│   └── TimeTracker.tsx
├── hooks/              # Custom React hooks
│   └── useTimeTracker.ts
├── services/           # API and external services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── api.ts
├── test/               # Test files
│   ├── unit/           # Unit tests
│   ├── components/     # Component tests
│   ├── hooks/          # Hook tests
│   └── services/       # Service tests
└── assets/             # Static assets
```

## Testing

The project includes a comprehensive test suite with 53 tests covering:

- **Unit Tests**: Type definitions and utility functions
- **Component Tests**: React component rendering and interactions
- **Hook Tests**: Custom React hooks behavior
- **Service Tests**: API integration and error handling

Run tests:
```bash
# Run all tests
npm run test

# Run tests once (CI mode)
npm run test:run

# Run with coverage
npm run test:coverage
```

## API Integration

The dashboard connects to a backend API for time tracking data. For the complete backend implementation, see the [API repository](https://github.com/kevinbinder/kb-freelance-api).

Configure the API endpoint in the service files located in `src/services/`.

## Development

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

### Testing Guidelines

- Write tests for all new features
- Maintain test coverage above 80%
- Use descriptive test names
- Follow the existing test patterns

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## License

This project is licensed under the MIT License.
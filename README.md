# Flashcards Learning App

A Progressive Web App (PWA) built with React, TypeScript, and Vite for creating and studying flashcards.

## Features

- Create and manage flashcards
- Study mode for learning
- Quiz mode for testing knowledge
- Progressive Web App (PWA) support
- Offline functionality
- Responsive design
- Local storage for data persistence

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- PWA (Progressive Web App)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- pnpm (v7 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Baotq1406/Flashcards_ENG.git
cd Flashcards_ENG
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Build for production:
```bash
pnpm build
```

5. Preview production build:
```bash
pnpm preview
```

## PWA Features

The application is configured as a Progressive Web App, which means it:

- Can be installed on mobile and desktop devices
- Works offline
- Receives automatic updates
- Has fast load times
- Is responsive across all devices

### Installing as PWA

1. Open the application in Chrome/Edge/Safari
2. Click the install button in the address bar
3. Follow the installation prompts

## Project Structure

```
├── public/
│   ├── icons/           # PWA icons
│   ├── manifest.json    # PWA manifest
│   └── masked-icon.svg  # Mask icon for PWA
├── src/
│   ├── components/      # React components
│   ├── types/          # TypeScript type definitions
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main App component
│   └── main.tsx        # Application entry point
├── index.html
├── vite.config.ts      # Vite configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm typecheck` - Run TypeScript type checking

### Best Practices

- Follow TypeScript best practices
- Use functional components with hooks
- Keep components small and focused
- Use Tailwind CSS for styling
- Write meaningful commit messages

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

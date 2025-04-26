# CS.Supply

A marketplace for CS:GO skins built with Next.js, TypeScript, and Tailwind CSS.

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Deployment on Render

This project is configured for easy deployment on Render:

1. Connect your GitHub repository
2. Render will automatically detect the configuration in `render.yaml`
3. The build process will install dependencies and build the project
4. The server will start using the production build

## Tech Stack

- Next.js 14.1.0
- TypeScript
- Tailwind CSS
- Axios for API requests

## Features

- Browse CS:GO skins with detailed information
- Real-time pricing with 5% markup
- Advanced filtering and sorting options
- Detailed skin information (float, wear, stickers, etc.)
- Modern and responsive UI
- Secure authentication and transactions
- Integration with LIS-Skins API

## Project Structure

```
cs.supply/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── skins/
│   │   │   └── SkinCard.tsx
│   │   └── filters/
│   │       └── SkinFilters.tsx
│   ├── lib/
│   │   └── api.ts
│   ├── types/
│   │   └── skin.ts
│   └── pages/
│       └── index.tsx
├── public/
├── styles/
└── package.json
```

## API Integration

The marketplace integrates with the LIS-Skins API for real-time skin data. Key features include:

- Fetching available skins with filtering and pagination
- Real-time price updates
- Detailed skin information
- Secure transaction handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- LIS-Skins API for providing the skin data
- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework

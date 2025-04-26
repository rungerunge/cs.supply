# CS.Supply - CS:GO Skin Marketplace

A modern CS:GO skin marketplace built with Next.js, TypeScript, and Tailwind CSS. This platform allows users to browse, buy, and sell CS:GO skins with real-time pricing and detailed item information.

## Features

- Browse CS:GO skins with detailed information
- Real-time pricing with 5% markup
- Advanced filtering and sorting options
- Detailed skin information (float, wear, stickers, etc.)
- Modern and responsive UI
- Secure authentication and transactions
- Integration with LIS-Skins API

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **State Management**: React Hooks
- **UI Components**: Headless UI, Heroicons
- **API Integration**: Axios, SWR
- **Animations**: Framer Motion

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/cs.supply.git
   cd cs.supply
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following content:
   ```
   NEXT_PUBLIC_API_KEY=181ae483-7513-4c2a-8230-3c4e48333f01
   NEXT_PUBLIC_API_BASE_URL=https://api.lis-skins.ru
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

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

## Deployment

The project is configured for deployment on Render.com. To deploy:

1. Push your changes to GitHub
2. Connect your GitHub repository to Render.com
3. Configure the build settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Environment Variables: Add the same variables from `.env.local`

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

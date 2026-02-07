# Health & Training App

An AI-powered health and training web application with offline-first architecture, mobile-first design, and adaptive planning capabilities.

## Features Implemented

### ✅ Phase 1-5: Foundation & Core Architecture
- **Vite + React + TypeScript** project setup
- **Tailwind CSS** with modern design system
- **Project structure** with organized folders for components, features, services
- **Dexie.js** database layer with IndexedDB for offline storage
- **Redux Toolkit** state management with feature-based slices
- **TypeScript type system** with comprehensive type definitions
- **User onboarding** flow with multi-step forms

### Core Services Implemented

#### Database Layer (`src/services/db/`)
- **Dexie Database**: IndexedDB with tables for users, plans, logs, and metrics
- **Repository Pattern**: Clean data access layer with repositories for:
  - User profiles
  - Meal and training plans
  - Daily logs
  - Body metrics

#### State Management (`src/features/`)
- **User Slice**: Profile management and onboarding
- **Plans Slice**: Meal and training plan management
- **Logs Slice**: Daily adherence tracking
- **Metrics Slice**: Body metrics and measurements

#### AI Service Layer (`src/services/ai/`)
- **Abstract AI Interface**: Provider-agnostic design
- **AI Service Factory**: Easy switching between providers
- **OpenAI Provider**: Full integration with GPT-4
- **Mock Provider**: For testing without API keys
- **Prompt Engineering**: Structured prompts for meal and training plans
- **Response Parsers**: Type-safe parsing of AI responses

#### Sync & Persistence
- **Sync Middleware**: Automatic Redux → IndexedDB synchronization
- **State Hydration**: App state restored from IndexedDB on load
- **Offline-First**: Full functionality without internet connection

### Type System (`src/types/`)

Comprehensive TypeScript types for:
- User profiles (body specs, preferences, schedule, goals)
- Plans (meals, training, nutrition, exercises)
- Logs (daily tracking, adherence, deviations)
- AI service integration

### UI Components (`src/components/`)

**Base UI Components:**
- Button (multiple variants and sizes)
- Card (header, content, footer)
- Input (text, number, date, time)
- Label
- Select

**Profile Components:**
- Body Specifications Form
- Preferences Form (dietary, equipment, location)
- Schedule Form (training days, meal times, sleep)
- Goals Form (weight, fitness objectives)

### Pages

- **Onboarding Page**: Multi-step wizard for user profile creation
- **Home Page**: Dashboard with quick access to all features

## 🚀 Quick Start

### Prerequisites

- Node.js 20.17+ (20.19+ recommended)
- npm 10+

### Installation & Setup

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open browser to http://localhost:5173

# 4. Complete onboarding and start using!
```

### Configuration (Optional)

The app works immediately with the **Mock AI Provider** (no setup needed).

For real AI-generated plans:
1. Get an OpenAI API key from https://platform.openai.com
2. Open the app and go to **Settings** page
3. Select **OpenAI** as the AI provider
4. Enter your API key
5. Save settings

AI provider and keys are stored securely in your local database.

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Base UI components (button, card, input, etc.)
│   └── profile/        # Profile-specific forms
├── features/           # Redux slices
│   ├── user/          # User profile management
│   ├── plans/         # Meal & training plans
│   ├── logs/          # Daily logging
│   └── metrics/       # Body metrics
├── services/          # Business logic
│   ├── ai/           # AI service integration
│   │   ├── providers/   # OpenAI, Mock providers
│   │   ├── prompts/     # Prompt templates
│   │   └── parsers/     # Response parsing
│   ├── db/           # Database & repositories
│   └── sync/         # State synchronization
├── store/            # Redux store configuration
├── hooks/            # Custom React hooks
├── utils/            # Utility functions
├── types/            # TypeScript definitions
└── pages/            # Route components
```

## Architecture Decisions

### Offline-First
- All data stored in IndexedDB
- Redux as runtime source of truth
- Automatic synchronization via middleware
- Service worker for offline caching (coming in Phase 10)

### AI Service Abstraction
- Provider-agnostic interface
- Easy switching between OpenAI, Anthropic, or mock providers
- Separated prompt engineering from provider logic
- Type-safe response parsing

### State Management
- Redux Toolkit for predictable state
- Feature-based slices for modularity
- Async thunks for complex operations
- Sync middleware for persistence

## Next Steps

### Phase 6-8: Plan Generation & Display
- UI for generating meal and training plans
- Plan display components with nutrition info
- Plan management (activate, archive, view)

### Phase 9: Daily View & Logging
- Daily dashboard showing today's plan
- Adherence logging interface
- Shopping list generator
- Meal timing optimization

### Phase 10: Adaptive Planning
- Adherence analysis algorithm
- Automatic plan adjustments based on patterns
- 7-day adherence tracking
- Smart recommendations

### Phase 11-12: Metrics & History
- Body metrics input and tracking
- Progress charts and visualizations
- Historical log viewing
- Calendar view of adherence

### Phase 13: PWA Configuration
- Service worker with Workbox
- App manifest for installation
- Offline indicator
- Caching strategies

### Phase 14: Mobile Optimization
- Bottom navigation for mobile
- Responsive layouts for all screen sizes
- Touch-friendly interactions
- Performance optimization

### Phase 15: Polish & Error Handling
- Loading states throughout
- Error boundaries
- Toast notifications
- Form validation feedback

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (latest)
- **State**: Redux Toolkit
- **Storage**: IndexedDB via Dexie.js
- **AI**: OpenAI API (abstracted)
- **Routing**: React Router v6

## Development Notes

### TypeScript Configuration

The project uses strict TypeScript with `verbatimModuleSyntax` enabled. This requires:
- Use `import type` for type-only imports
- Explicit type annotations for better IDE support
- Strict type checking for reliability

### Database Schema

**Tables:**
- `userProfiles`: User information and preferences
- `mealPlans`: Meal plans with daily breakdowns
- `trainingPlans`: Training plans with sessions
- `dailyLogs`: Daily adherence logs
- `bodyMetrics`: Body measurements over time
- `shoppingLists`: Generated shopping lists

### AI Provider Configuration

The app supports multiple AI providers:

1. **Mock Provider** (default): For testing without API costs
2. **OpenAI Provider**: GPT-4 integration for real plans
3. **Anthropic Provider** (future): Claude integration

Switch providers by updating `VITE_AI_PROVIDER` in `.env`.

## Testing the App

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser** to http://localhost:5173

3. **Complete the onboarding:**
   - Enter your body specifications
   - Set your dietary preferences
   - Configure your training schedule
   - Define your fitness goals

4. **The profile is saved to IndexedDB** and persists across page refreshes

## Current Status

✅ **ALL PHASES COMPLETED (Phases 1-15)** 🎉

### Foundation & Core (Phases 1-7)
- ✅ Project setup and configuration
- ✅ Database and state management
- ✅ AI service integration
- ✅ Type system
- ✅ User onboarding flow
- ✅ Basic UI components

### Features (Phases 8-11)
- ✅ Plan generation UI
- ✅ Plan display components
- ✅ Active plan management
- ✅ Daily view and logging
- ✅ Adherence tracking
- ✅ Shopping list generation
- ✅ Adaptive planning algorithm
- ✅ Adherence analysis
- ✅ Automatic plan adjustments

### Analytics & Tracking (Phase 12)
- ✅ Body metrics tracking
- ✅ Progress charts (weight, body fat)
- ✅ Historical log viewing
- ✅ Calendar view of adherence

### Mobile & PWA (Phases 13-14)
- ✅ PWA configuration with service worker
- ✅ Offline support
- ✅ Install prompt
- ✅ Bottom navigation for mobile
- ✅ Side navigation for desktop
- ✅ Responsive layouts
- ✅ Touch-friendly design (44px+ targets)

### Polish (Phase 15)
- ✅ Error boundary
- ✅ Toast notifications
- ✅ Loading overlays
- ✅ Loading spinners
- ✅ Empty states
- ✅ Confirmation dialogs
- ✅ Offline indicator

## Contributing

The app follows these principles:
- **Mobile-first**: Design for mobile, enhance for desktop
- **Offline-first**: Work without internet connection
- **Type-safe**: Comprehensive TypeScript types
- **Modular**: Feature-based architecture
- **Testable**: Separated concerns and abstractions

## License

MIT

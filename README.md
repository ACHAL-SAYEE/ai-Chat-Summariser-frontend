# AI Chat Portal - Frontend Implementation

This is the React + Tailwind CSS frontend for the AI Chat Portal assignment. This frontend is ready to be connected to your Django REST Framework backend.

## 🎨 Features Implemented

### 1. **Conversations Dashboard** (`/`)
- List view of all past conversations
- Search functionality to filter conversations
- Click any conversation to view details
- Shows conversation title, summary, date, and message count

### 2. **Chat Interface** (`/chat`)
- Real-time messaging UI
- Message bubbles for user and AI messages
- Start/End conversation functionality
- Timestamp display for each message
- Textarea with Enter to send (Shift+Enter for new line)

### 3. **Conversation Detail** (`/conversation/:id`)
- Full conversation history view
- AI-generated summary display
- Individual message display with timestamps
- Back navigation to dashboard

### 4. **Intelligence Query** (`/intelligence`)
- Ask questions about past conversations
- Display AI responses with context
- Show referenced conversations
- Search history of queries

## 🎯 Design System

The app uses a modern, clean design inspired by ChatGPT and Claude:

- **Color Scheme**: Deep blue primary (`#3B82F6`) with cyan accents (`#06B6D4`)
- **Typography**: Clean, readable fonts with proper hierarchy
- **Spacing**: Consistent padding and margins using Tailwind
- **Animations**: Smooth transitions and hover effects
- **Responsive**: Mobile-first design that works on all screen sizes

## 🚀 Running the Frontend

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📦 Environment Variables

Create a `.env` file:
```
VITE_API_URL=http://localhost:8000/api
```

## 🎨 Customization

All design tokens are in `src/index.css` and `tailwind.config.ts`:
- Colors: Modify HSL values in `:root`
- Spacing: Adjust container padding
- Borders: Change `--radius` value
- Shadows: Update `--shadow-*` variables

## 📱 Responsive Design

The app is fully responsive:
- Mobile: Single column layout, hamburger menu
- Tablet: Optimized spacing and text sizes
- Desktop: Full navigation, wider containers

## ✅ Features Checklist

- ✅ Clean, modern chat UI (similar to ChatGPT)
- ✅ Real-time messaging interface
- ✅ Conversation list with search
- ✅ Conversation detail view
- ✅ Intelligence query interface
- ✅ Start/End conversation buttons
- ✅ Message timestamps
- ✅ Responsive design
- ✅ Semantic HTML structure
- ✅ Tailwind CSS styling
- ✅ TypeScript types
- ✅ Component-based architecture


## 📚 Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- React Router v6
- Lucide React Icons
- Vite


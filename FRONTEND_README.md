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

## 🔌 Backend Integration Points

### Required Django REST API Endpoints:

1. **GET `/api/conversations/`**
   - Returns list of all conversations
   - Response: `[{ id, title, summary, date, messageCount }]`

2. **GET `/api/conversations/:id/`**
   - Returns full conversation with messages
   - Response: `{ id, title, summary, date, messages: [{ id, content, sender, timestamp }] }`

3. **POST `/api/conversations/`**
   - Creates new conversation and sends message
   - Body: `{ message: string }`
   - Response: `{ conversationId, aiResponse }`

4. **POST `/api/conversations/:id/end/`**
   - Ends conversation and triggers AI summary
   - Response: `{ summary }`

5. **POST `/api/intelligence/query/`**
   - Queries AI about past conversations
   - Body: `{ query: string }`
   - Response: `{ response, relevantConversations: [] }`

## 📝 Integration Steps

### Step 1: Update API Base URL
Create a file `src/lib/api.ts`:

```typescript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  getConversations: () => fetch(`${API_BASE_URL}/conversations/`),
  getConversation: (id: string) => fetch(`${API_BASE_URL}/conversations/${id}/`),
  sendMessage: (conversationId: string, message: string) => 
    fetch(`${API_BASE_URL}/conversations/${conversationId}/messages/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    }),
  endConversation: (id: string) => 
    fetch(`${API_BASE_URL}/conversations/${id}/end/`, { method: 'POST' }),
  queryIntelligence: (query: string) =>
    fetch(`${API_BASE_URL}/intelligence/query/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    })
};
```

### Step 2: Update Pages to Use Real API

Replace mock data imports with actual API calls using React Query or fetch.

Example for `src/pages/Index.tsx`:
```typescript
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

// Replace mockConversations with:
const [conversations, setConversations] = useState([]);

useEffect(() => {
  api.getConversations()
    .then(res => res.json())
    .then(data => setConversations(data));
}, []);
```

### Step 3: Update Chat.tsx for Real-time Messaging

Replace the simulated AI response with actual API call:
```typescript
const handleSend = async () => {
  // ... existing user message code ...
  
  try {
    const response = await api.sendMessage(conversationId, input);
    const data = await response.json();
    
    const aiMessage: Message = {
      id: data.messageId,
      content: data.aiResponse,
      sender: \"ai\",
      timestamp: new Date(data.timestamp).toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, aiMessage]);
  } catch (error) {
    console.error('Failed to send message:', error);
    // Show error toast
  }
};
```

### Step 4: Update Intelligence.tsx

Replace simulated search with actual API call:
```typescript
const handleSearch = async () => {
  setIsSearching(true);
  
  try {
    const response = await api.queryIntelligence(query);
    const data = await response.json();
    
    const newResult: QueryResult = {
      query: query,
      response: data.response,
      relevantConversations: data.relevantConversations
    };
    
    setResults(prev => [newResult, ...prev]);
  } catch (error) {
    console.error('Intelligence query failed:', error);
  } finally {
    setIsSearching(false);
  }
};
```

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

## 🔧 Next Steps

1. Set up your Django backend with PostgreSQL
2. Implement the required API endpoints
3. Integrate LLM (OpenAI/Claude/Gemini/LM Studio)
4. Connect frontend to backend APIs
5. Test end-to-end functionality
6. Add error handling and loading states
7. Implement WebSocket for real-time updates (optional)

## 📚 Technologies Used

- React 18
- TypeScript
- Tailwind CSS
- React Router v6
- Shadcn UI Components
- Lucide React Icons
- Vite

## 💡 Backend Integration Tips

1. **CORS**: Configure Django CORS headers to allow frontend requests
2. **Authentication**: Add JWT/session auth if required
3. **WebSockets**: Consider Django Channels for real-time chat
4. **Error Handling**: Return consistent error format from backend
5. **Pagination**: Implement pagination for conversation lists
6. **Caching**: Cache AI responses for better performance

Good luck with your assignment! 🚀

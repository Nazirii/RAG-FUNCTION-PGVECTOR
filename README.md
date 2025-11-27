# 🍽️ Borneo Eatery - Restaurant API with RAG

Modern restaurant management API built with Laravel, featuring AI-powered chat assistant using RAG (Retrieval-Augmented Generation) with pgvector for semantic menu search.

## 🚀 Tech Stack

### Backend Framework
- **Laravel 11** - Modern PHP framework
- **PHP 8.3+** - Latest PHP version
- **PostgreSQL 16** - Primary database
- **pgvector** - Vector similarity search extension

### AI & Machine Learning
- **Google Gemini AI** - LLM for chat assistant (gemini-2.5-flash)
- **RAG (Retrieval-Augmented Generation)** - Semantic search with embeddings
- **pgvector** - Vector database for similarity search
- **Cosine Similarity** - Menu recommendation algorithm

### Key Features
- RESTful API architecture
- Vector embeddings for semantic search
- Function calling with AI assistant
- Session-based cart management
- Real-time order tracking

## 📋 Features

### 🤖 AI Chat Assistant
- Natural language menu search
- Smart recommendations based on preferences
- Cart management via chat
- Order placement through conversation
- Context-aware responses using RAG

### 📦 Core Functionality
- **Menu Management** - CRUD operations with vector embeddings
- **Cart System** - Session-based shopping cart
- **Order Processing** - Complete order lifecycle
- **Semantic Search** - AI-powered menu discovery
- **Function Calling** - Structured AI interactions

## 🛠️ Installation

### Prerequisites
- PHP 8.3+
- PostgreSQL 16+
- Composer
- pgvector extension

### Setup

1. **Clone repository**
```bash
git clone https://github.com/Nazirii/RAG-FUNCTION-PGVECTOR.git
cd RAG-FUNCTION-PGVECTOR
```

2. **Install dependencies**
```bash
composer install
```

3. **Environment configuration**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Configure database** (`.env`)
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=resto_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

GEMINI_API_KEY=your_gemini_api_key
```

5. **Setup database with pgvector**
```sql
CREATE DATABASE resto_db;
CREATE EXTENSION vector;
```

6. **Run migrations & seeders**
```bash
php artisan migrate --seed
```

7. **Start development server**
```bash
php artisan serve
```

API available at: `http://localhost:8000/api`

## 📚 API Endpoints

### Menu
- `GET /api/menu` - List all menus (with filters)
- `GET /api/menu/{id}` - Get menu detail
- `POST /api/menu` - Create menu
- `PUT /api/menu/{id}` - Update menu
- `DELETE /api/menu/{id}` - Delete menu
- `GET /api/menu/group-by-category` - Group menus by category
- `GET /api/menu/search` - Semantic search with RAG

### Cart
- `GET /api/cart` - Get cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item
- `DELETE /api/cart/{id}` - Remove cart item
- `DELETE /api/cart` - Clear cart
- `POST /api/cart/checkout` - Checkout order

### Orders
- `GET /api/orders` - Get order history
- `GET /api/orders/{orderNumber}` - Get order detail

### AI Assistant
- `POST /api/ai/search` - Semantic menu search
- `POST /api/ai/chat` - AI chat with function calling

## 🧠 How RAG Works

1. **Embedding Generation**
   - Menu data converted to 768-dimensional vectors using Gemini
   - Stored in PostgreSQL with pgvector

2. **Semantic Search**
   - User query embedded using same model
   - Cosine similarity search in vector space
   - Top relevant menus retrieved

3. **Context-Aware Response**
   - Retrieved menus provided as context to LLM
   - AI generates response based on actual menu data
   - Function calling for cart operations

## 🔧 Key Services

### `GeminiEmbeddingService`
Handles vector embedding generation for menu items using Gemini API.

### `GeminiChatService`
Manages AI chat with function calling capabilities:
- `add_to_cart` - Add items to cart
- `view_cart` - View current cart
- `remove_from_cart` - Remove items
- `checkout` - Process order
- `get_order_status` - Check order status

## 🗄️ Database Schema

### Tables
- `menus` - Menu items with vector embeddings
- `carts` - Session-based shopping cart
- `transactions` - Order records
- `users` - User authentication

### pgvector Integration
```sql
ALTER TABLE menus ADD COLUMN embedding vector(768);
CREATE INDEX ON menus USING hnsw (embedding vector_cosine_ops);
```

## 🚀 Deployment

### Production Setup
```bash
# Update dependencies
composer install --no-dev --optimize-autoloader

# Run migrations
php artisan migrate --force

# Cache configuration
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set permissions
chmod -R 775 storage bootstrap/cache
```

### Environment Variables
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_DATABASE=your-database

GEMINI_API_KEY=your-production-key
```

## 📝 Development

### Generate Embeddings for Existing Menus
```bash
php artisan app:generate-menu-embeddings
```

### Run Tests
```bash
php artisan test
```

## 🔐 Security

- CORS configuration for frontend integration
- Input validation on all endpoints
- SQL injection prevention via Eloquent ORM
- Session-based authentication

## 📖 Documentation

- **API Documentation**: [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Deployment Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **PostgreSQL Setup**: [SETUP_POSTGRESQL.md](SETUP_POSTGRESQL.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## 👨‍💻 Author

**Naziri**
- GitHub: [@Nazirii](https://github.com/Nazirii)

---

Built with ❤️ using Laravel, PostgreSQL, and Google Gemini AI

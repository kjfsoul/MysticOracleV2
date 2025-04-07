# Mystic Oracle V2 Setup Guide

This guide will help you set up the Mystic Oracle V2 application, including Supabase authentication and Hugging Face integration.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git
- A Supabase account
- A Hugging Face account (for AI features)

## Setting Up Supabase

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign in or create an account
2. Create a new project
3. Choose a name for your project (e.g., "mystic-oracle")
4. Set a secure database password
5. Choose a region close to your users
6. Click "Create new project"

### 2. Get Your Supabase Credentials

1. Once your project is created, go to the project dashboard
2. Click on the "Settings" icon in the left sidebar
3. Click on "API" in the submenu
4. You'll find your project URL and anon key in the "Project API keys" section
5. Copy these values for the next step

### 3. Set Up Environment Variables

1. Create a `.env` file in the root directory of your project
2. Add the following variables:

```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Create Database Tables

1. Go to the "SQL Editor" in your Supabase dashboard
2. Copy the contents of `supabase/migrations/20240516_auth_tables.sql`
3. Paste it into the SQL editor and run the query
4. This will create all the necessary tables and set up row-level security

### 5. Enable Authentication Providers

1. Go to "Authentication" > "Providers" in your Supabase dashboard
2. Enable "Email" authentication
3. Optionally, enable other providers like Google, GitHub, etc.
4. For each provider, follow the specific setup instructions

## Setting Up Hugging Face Integration

### 1. Create a Hugging Face Account

1. Go to [Hugging Face](https://huggingface.co/) and sign up for an account
2. Verify your email address

### 2. Get an API Token

1. Log in to your Hugging Face account
2. Click on your profile picture in the top-right corner
3. Select "Settings" from the dropdown menu
4. Navigate to the "Access Tokens" section
5. Click "New Token"
6. Give your token a name (e.g., "MysticOracle")
7. Select the appropriate permissions (typically "Read" is sufficient for inference)
8. Click "Generate Token"
9. Copy the token and add it to your `.env` file:

```
HUGGING_FACE_API_KEY=your-hugging-face-token
```

### 3. Deploy Models on Inference Endpoints

#### For Embedding Model:

1. Go to the [sentence-transformers/all-MiniLM-L6-v2](https://huggingface.co/sentence-transformers/all-MiniLM-L6-v2) model page
2. Click the "Deploy" button
3. Select "Inference Endpoints"
4. Configure your endpoint:
   - Name: "mystic-oracle-embeddings"
   - Region: Choose one close to your users
   - Instance type: CPU (for testing)
   - Scaling: Min 0, Max 1
5. Click "Create Endpoint"
6. Once deployed, copy the endpoint URL to your `.env` file:

```
HUGGING_FACE_EMBEDDING_ENDPOINT=your-embedding-endpoint-url
```

#### For Text Generation Model:

1. Go to the [mistralai/Mistral-7B-Instruct-v0.2](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2) model page
2. Click the "Deploy" button
3. Select "Inference Endpoints"
4. Configure your endpoint:
   - Name: "mystic-oracle-text-generation"
   - Region: Choose one close to your users
   - Instance type: GPU (recommended for text generation)
   - Scaling: Min 0, Max 1
5. Click "Create Endpoint"
6. Once deployed, copy the endpoint URL to your `.env` file:

```
HUGGING_FACE_TEXT_GENERATION_ENDPOINT=your-text-generation-endpoint-url
```

## Setting Up MCP Servers for Development

For local development, you can use Docker to set up Model Control Panel (MCP) servers:

### 1. Install Docker

1. Download and install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Start Docker Desktop

### 2. Run the Development Environment

1. Open a terminal in your project directory
2. Run the following command to start all services:

```bash
docker-compose up -d
```

This will start:
- A vector database (Redis with RedisJSON and RediSearch)
- An embedding service
- A text generation service
- A sentiment analysis service
- A development proxy

### 3. Access the Services

- Vector Database UI: http://localhost:8001
- Embedding Service: http://localhost:8080
- Text Generation Service: http://localhost:8081
- Sentiment Analysis Service: http://localhost:8082
- Development Proxy: http://localhost:7778

## Running the Application

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to:

```
http://localhost:7777
```

## Troubleshooting

### Authentication Issues

- Make sure your Supabase URL and anon key are correct
- Check that you've enabled the authentication providers you want to use
- Verify that the database tables were created successfully

### Hugging Face Integration Issues

- Ensure your Hugging Face API token has the correct permissions
- Check that your endpoints are deployed and running
- Verify that the endpoint URLs in your `.env` file are correct

### Database Issues

- Run the SQL migrations again to ensure all tables are created
- Check the Supabase logs for any errors
- Verify that row-level security policies are in place

## Next Steps

1. Customize the authentication flow
2. Implement personalized tarot interpretations
3. Set up the journal feature with vector embeddings
4. Create the astrology calculation engine
5. Implement the continuous learning system

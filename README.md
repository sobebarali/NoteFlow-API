# NoteFlow API

## Overview

NoteFlow API is a secure and scalable RESTful API designed for efficient management of digital notes. It allows users to create, read, update, delete, and share notes, as well as search for them based on keywords. Featuring robust authentication and authorization mechanisms, it ensures a secure environment for personal and shared notes.

## Features

- **User Authentication**: Secure signup and login processes.
- **Note Management**: Create, read, update, and delete personal notes.
- **Note Sharing**: Share notes with other users.
- **Search Functionality**: Find notes quickly using keywords.
- **Security and Performance**: Rate limiting, request throttling, and secure endpoints.

## API Endpoints

### Authentication Endpoints
- POST /api/auth/signup: Create a new user account.
- POST /api/auth/login: Log in to an existing user account and receive an access token.

### Note Endpoints
- GET /api/notes: Get a list of all notes for the authenticated user.
- GET /api/notes/:id: Get a note by ID for the authenticated user.
- POST /api/notes: Create a new note for the authenticated user.
- PUT /api/notes/:id: Update an existing note by ID for the authenticated user.
- DELETE /api/notes/:id: Delete a note by ID for the authenticated user.
- POST /api/notes/:id/share: Share a note with another user for the authenticated user

## Getting Started

### Installation

1. Clone the repo

```bash
$ git clone https://github.com/sobebarali/NoteFlow-API
```


3. Install Packages

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

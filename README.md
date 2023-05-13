# RateMyApp Website

## Introduction

RateMyApp is a web application that allows users to rate and review various applications. The purpose of the application is to provide a platform where users can rate, review and provide feedback on different applications and help others in choosing the best applications.

## Stack Used

- **Next.js**: Next.js is a React-based web application framework that allows for easy server-side rendering, routing, and API routes creation.
- **TRPC**: TRPC is a small and fast RPC (Remote Procedure Call) framework. It's designed to simplify communication between the client and the server by using TypeScript types to define the API.
- **Prisma**: Prisma is an ORM (Object Relational Mapping) tool that allows for easy database interactions using TypeScript.
- **Clerk**: Clerk is an authentication and user management tool that provides a secure and easy-to-use authentication system.

## Features

- User registration and authentication with Clerk
- User can create new apps to be rated
- User can rate existing apps
- User can view average ratings and comments for each app
- User can view their own profile and update their display name and profile picture
- User can view the profile of other users and their apps
- User can search for apps by name or description or username
- User can add a donation button and a collaboration button
- User can donate to a user via project or his profile if activated

## Future Features

- User can follow other users to stay updated on their new apps and ratings
- User can filter apps by category or tags
- User can leave replies to comments
- User can report inappropriate apps or comments
- User can receive notifications for new ratings or comments on their apps
- User can share apps on social media platforms
- User can integrate with third-party app stores to pull in existing apps for rating
- User can view a leaderboard of the most highly-rated apps and users
- Implement a system for tracking user activity and displaying user statistics.
- Implement a system for suggesting similar apps based on user ratings and preferences.

## Getting Started

To get started with the project, please follow the instructions below:

1. Clone the repository
2. Install the dependencies using `npm install`
3. Create a `.env` file with the following contents:

```javascript
DATABASE_URL=<your_database_url>
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your_clerk_publishable_key>
CLERK_API_KEY=<your_clerk_api_key>
```

4. Run the development server using `npm run dev`
5. Visit `http://localhost:3000` to see the application running.

## Deployment

The application is deployed using Vercel

## License

This project is licensed under a proprietary license

## Contributors

- Bentaleb Sami

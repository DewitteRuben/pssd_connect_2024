# PSSD Connect

PSSD Connect is a social app designed to help individuals suffering from Post-SSRI Sexual Dysfunction (PSSD) find meaningful connections in a safe and supportive environment.

## Tech Stack

PSSD Connect is built with a MongoDB database connected to a Node.js backend. The backend is accessed by a React.js frontend, which is scaffolded using Vite. The backend utilizes Express.js and Socket.io to handle communication with the frontend, while Chakra UI is used for building basic frontend components. Mobx is implemented for global state management.

Firebase is used for authentication, cloud messaging (for push notifications), and SMS verification. Getstream.io is integrated to set up the chat system between users.

## Architecture

### Suggestions and Matching

Similar to dating apps like Tinder, users are "matched" based on their personal preferences. Before a match can occur, users first receive suggestions of other users who meet their criteria. These suggestions are generated through a complex query in MongoDB, computed both at regular intervals and when the app initially loads. The suggested user IDs are then stored in the MongoDB `relationships` collection.

Once suggestions are made, users can see each other in the app and choose to either `like` or `dislike` each other. If both users `like` each other, a match is created, and a Getstream.io channel is set up to enable communication between them.

Suggestions are updated at regular intervals via a direct WebSocket connection using Socket.io. Additionally, whenever a user updates their preferences, new suggestions are generated and updated accordingly.

### Authorization

Firebase manages user authentication, generating a unique JWT token for each authenticated user. This token is used to authorize the user on the backend, where it is verified using custom Express.js middleware.

### Development

### Setup

1. Run `npm i` in the root directory.
2. Run `npm i` in the `backend/src` directory.
3. Run `make build` in the root directory.
4. Run `npm run dev` in the root directory.
5. Open [http://localhost:5173](http://localhost:5173) to start using the project.

### Test Phone Numbers for Account Verification

| Phone Number      | Verification Code |
|-------------------|-------------------|
| +31 622733030     | 123456            |
| +31 622733031     | 123456            |
| +31 622733032     | 123456            |
| +31 622733033     | 123456            |
| +31 622733034     | 123456            |
| +31 622733035     | 123456            |
| +31 622733036     | 123456            |
| +31 622733037     | 123456            |
| +31 622733038     | 123456            |
| +31 622733039     | 123456            |

### Configuration

This demo projects comes with credentials zipped together, so there is no need for additional configuration.
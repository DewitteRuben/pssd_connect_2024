import express from "express";
import FirebaseApp from "../firebase/firebase.js";
import { ExpressError } from "../errors.js";
import { Socket } from "socket.io";

export const firebaseAuthMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  if (!req.headers.authorization)
    return next(
      new ExpressError({
        code: 500,
        message: "Authorization header is missing from the request",
      })
    );

  const [authType, bearerToken] = req.headers.authorization.split(" ");

  if (!authType)
    return next(
      new ExpressError({
        code: 500,
        message: "Authorization type, needs to be of type 'Bearer'",
      })
    );

  try {
    const { uid } = await FirebaseApp.auth().verifyIdToken(bearerToken);
    req.authorizedUid = uid;

    if (
      (req.body.uid && req.body.uid !== req.authorizedUid) ||
      (req.params.uid && req.params.uid !== req.authorizedUid)
    ) {
      return next(
        new ExpressError({
          code: 401,
          message: "Unauthorized",
        })
      );
    }

    next();
  } catch (error) {
    console.log("Issue validating id token", { error });
    next(
      new ExpressError({
        code: 500,
        message: "The IdToken is invalid",
      })
    );
  }
};

type MiddlewareFunction = (socket: Socket, next: (err?: any) => void) => Promise<void>;

export const firebaseAuthMiddlewareSocketIO: MiddlewareFunction = async (
  socket,
  next
) => {
  if (!socket.handshake.headers.authorization)
    return next(
      new ExpressError({
        code: 500,
        message: "Authorization header is missing from the request",
      })
    );

  const [authType, bearerToken] = socket.handshake.headers.authorization.split(" ");

  if (!authType)
    return next(
      new ExpressError({
        code: 500,
        message: "Authorization type, needs to be of type 'Bearer'",
      })
    );

  try {
    const { uid } = await FirebaseApp.auth().verifyIdToken(bearerToken);
    socket.data.authorizedUid = uid;

    next();
  } catch (error) {
    next(
      new ExpressError({
        code: 500,
        message: "The IdToken is invalid",
      })
    );
  }
};

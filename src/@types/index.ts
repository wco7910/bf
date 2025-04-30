declare module '*.png';
declare module '*.css';
declare namespace Express {
    export interface Request {
        user: any;
    }
    export interface Response {
        user: any;
    }
  }
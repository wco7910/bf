// eslint-disable-next-line no-unused-vars
import { Router } from 'express';
// API SERVER Routes 설정 및 PASSPORT
import authJwt from './authJwt';

const applyMiddleware = (router: Router) => {
  //-------------------------------------------------
  // PASSPORT
  authJwt.initAuthJwt(router);
  //-------------------------------------------------
};

export default applyMiddleware;

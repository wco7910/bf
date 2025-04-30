const api_version = 'v1';
import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import applyMiddleware from '../middleware';
import { formidable } from 'formidable';
import * as dotenv from 'dotenv'; 
import * as path from 'path';
const __dirname = path.resolve();
import routeHandler from './router';
import swaggerHandler from './swagger';
import databaseHandler from './database';

const launch = async () => {
  try {
    const isEnv = dotenv.config({
      path: path.join(
        __dirname,
        './config',
        `.env_${process.env.NODE_ENV || 'development'}`
      ),
    });

    if (isEnv.parsed == undefined) {
      throw new Error('Cannot loaded environment variables file.');
    }

    const pkg: any = await import(path.join(__dirname, '/package.json'), {
      assert: { type: 'json' },
    });

    process.env.PACKAGE_NAME = pkg?.default?.name || 'Unknown Project Name';
    process.env.PCKAGE_DESCRIPTION =
      pkg?.default?.description || 'Unknown Description';
      
    await databaseHandler();
  } catch (e) {
    console.log(
      `[Critical Info]Database init failed!!![env=${process.env.NODE_ENV}]`
    );
  }

  const controllers = await routeHandler();

  const app = await express();
  app.use(cors());
  app.use(express.json({ limit: '498mb' }));
  app.use(express.urlencoded({ limit: '498mb', extended: false }));

  app.use((req, res, next) => {
    res.header(
      'Access-Control-Allow-Methods',
      'GET, PUT, POST, PATCH, DELETE, HEAD, OPTIONS'
    );
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  app.use('/public', express.static('public'));

  app.use((req: any, res: any, next: any) => {
    if (req.originalUrl !== '/v1/file' && req.originalUrl !== '/v1/web/account/profileImgUpload' && req.originalUrl !== '/v1/web/exercise/customExercise') {
      next();
      return;
    }

    const form = formidable({
      multiples: true,
      maxFileSize: 50 * 1024 * 1024,
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        next(err);
        return;
      }
      req.fields = fields || undefined;
      req.files = files || undefined;
      next();
    });
  });

  app.use(`/${api_version}`, controllers.router);
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === undefined ||
    process.env.NODE_ENV === 'production'
  ) {
    console.log(`!!![importannt] env=${process.env.NODE_ENV}`);
    const swagger = swaggerHandler(
      {
        // protocol: 'http',
        host: process.env.SWAGGER_HOST || null,
        port: process.env.PORT || 3000,
        ...controllers,
      },
      api_version /* path prefix */
    );
    swagger.forEach((v) => {
      app.use(...v);
    });

  }

  app.use('/', (req, res) => {
    res.type('text/plain');
    res.status(200);
    res.send('service alive');
  });

  process.on('uncaughtException', (err) => {
    console.error("server dead uncaughtException");
    process.exit(1);
  });

  app.use((req, res) => {
    let url = req.protocol + '://' + req.get('host') + req.originalUrl;
    res.type('text/plain');
    res.status(402);
    res.send('402 - Not Found');
  });

  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.type('text/plain');
    res.status(498);
    res.send('498 - Server Error');
  });

  applyMiddleware(app);
  return { app };
};

export default { launch };

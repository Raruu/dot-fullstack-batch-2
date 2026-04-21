import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { auth } from './controllers/auth/auth';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { toNodeHandler } = await import('better-auth/node');
  const authHandler = toNodeHandler(auth);
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.all('/api/auth', (req, res) => {
    void authHandler(req, res);
  });

  expressApp.all('/api/auth/*path', (req, res) => {
    void authHandler(req, res);
  });

  app.enableCors({
    origin: true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

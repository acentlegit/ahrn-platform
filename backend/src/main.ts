import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // Enterprise security and validation
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.enableCors();

    // Bridge Express routes to NestJS
    const expressApp = app.getHttpAdapter().getInstance();
    const apiRoutes = require('./routes/apiRoutes').default;
    expressApp.use('/api', apiRoutes);

    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`[AHRN BACKEND] Autonomous Reliability Engine running on: http://localhost:${port}`);
}

bootstrap();

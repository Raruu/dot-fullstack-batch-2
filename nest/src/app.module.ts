import { Module } from '@nestjs/common';
import { QueriesController } from './controllers/queries.controller';
import { ActionsController } from './controllers/actions.controller';
import { AssetsController } from './controllers/assets.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './controllers/auth/auth';

@Module({
  imports: [AuthModule.forRoot({ auth })],
  controllers: [
    QueriesController,
    ActionsController,
    AssetsController,
  ],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ApiQueriesController } from './controllers/queries.controller';
import { ApiActionsController } from './controllers/actions.controller';
import { ApiAssetsController } from './controllers/assets.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [
    ApiQueriesController,
    ApiActionsController,
    ApiAssetsController,
  ],
  providers: [AppService],
})
export class AppModule {}

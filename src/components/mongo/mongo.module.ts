import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import MongoConfigService from './mongo.config.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({ useClass: MongoConfigService }),
    MongooseModule.forFeature([
     
    ]),
  ],
  providers: [
   
  ],
  exports: [
    
  ],
})
export class MongoConnectModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://localhost:27017/ahrn'),
        // These would be the actual logic modules - placeholders for health/audit
    ],
    controllers: [],
    providers: [],
})
export class AppModule { }

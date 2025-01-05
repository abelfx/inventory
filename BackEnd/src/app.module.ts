import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './service/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './model/user.schema';
import { ProductSchema } from './model/product.schema';
import { JwtModule } from '@nestjs/jwt';
import { ProductService } from './service/product.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://abeltesfa198:CYHYQbUUUagk0EyS@ims.or9ib.mongodb.net/?retryWrites=true&w=majority&appName=ims',
    ),
    JwtModule.register({
      secret: 'secretSecret',
      signOptions: { expiresIn: '1h' },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, ProductService],
})
export class AppModule {}

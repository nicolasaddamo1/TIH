import { Body, Controller, Post } from '@nestjs/common';

@Controller('reparacion')
export class ReparacionController {
   constructor() {}
   
   @Post('')
   async create(
    @Body() 
   ) {

   }
}
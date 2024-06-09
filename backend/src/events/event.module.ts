import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Events } from '../database/models/event.model';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [SequelizeModule.forFeature([Events]), ScheduleModule.forRoot()],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService],
})
export class EventModule {}

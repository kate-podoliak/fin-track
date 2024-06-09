import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  BadRequestException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { AuthGuard } from '@nestjs/passport';

export interface CreateEvent {
  name: string;
  amount: number;
  date: Date;
}

@Controller('events')
export class EventController {
  constructor(private eventsService: EventService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createEvent(@Body() createEvent: CreateEvent, @Req() req) {
    const userId = req.user.dataValues.id;
    if (!userId) {
      throw new BadRequestException('UserID is missing');
    }
    return this.eventsService.createEvent(createEvent, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAllEvents(@Req() req) {
    const userId = req.user.dataValues.id;
    return this.eventsService.getEventsById(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('count-ending')
  async countEndingEvents(@Req() req) {
    const userId = req.user.dataValues.id;
    return await this.eventsService.countEndingEventsById(userId);
  }

  @Delete(':id')
  async removeEvent(@Param('id') id: number) {
    return this.eventsService.removeEvent(id);
  }
}

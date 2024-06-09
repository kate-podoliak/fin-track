import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Events, SubscriptionStatus } from '../database/models/event.model';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateEvent } from './event.controller';

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Events)
    private eventsModel: typeof Events,
  ) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  async handleCron() {
    const events = await this.eventsModel.findAll();
    const currentDate = new Date();

    for (const event of events) {
      const eventDate = new Date(event.date);
      const diffDays = Math.ceil(
        (eventDate.getTime() - currentDate.getTime()) / (1000 * 3600 * 24),
      );

      if (diffDays <= 3 && event.status === SubscriptionStatus.Active) {
        await event.update({ status: SubscriptionStatus.Ending });
      } else if (diffDays <= 1 && event.status === SubscriptionStatus.Ending) {
        const newDate = new Date(eventDate);
        newDate.setMonth(newDate.getMonth() + 1);
        await event.update({ date: newDate });

        await event.update({ status: SubscriptionStatus.Active });
      }
    }
  }

  async createEvent(createEvent: CreateEvent, userId: number): Promise<Events> {
    return this.eventsModel.create({
      ...createEvent,
      userId,
    });
  }

  async getEventsById(userId: number): Promise<Events[]> {
    return this.eventsModel.findAll({
      where: { userId },
    });
  }

  async countEndingEventsById(userId: number): Promise<number> {
    return this.eventsModel.count({
      where: {
        userId,
        status: SubscriptionStatus.Ending,
      },
    });
  }

  async findOneEvent(id: number): Promise<Events> {
    const event = await this.eventsModel.findByPk(id);
    if (!event) {
      throw new NotFoundException('Подія не знайдена.');
    }
    return event;
  }

  async removeEvent(id: number): Promise<void> {
    const event = await this.findOneEvent(id);
    await event.destroy();
  }
}

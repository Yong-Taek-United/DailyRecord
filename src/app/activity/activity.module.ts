import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { Activity } from 'src/shared/entities/activity.entity';
import { Task } from 'src/shared/entities/task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Task])],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}

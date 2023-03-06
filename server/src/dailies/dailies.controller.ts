import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DailiesService } from './dailies.service';

@Controller('dailies')
export class DailiesController {
    constructor(private readonly dailiesService: DailiesService) {}

    @Post()
    create(@Body() dailyData) {
        return this.dailiesService.create(dailyData);
    }

    @Get('/getDailies/:id/:year/:month')
    getDailies(
        @Param('id') userId: number,
        @Param('year') year: number, 
        @Param('month') month: number
        ) {
        return this.dailiesService.getDailies(userId, year, month);
    }

    @Get('/:id')
    getDaily(@Param('id') dailyId: number) {
        return this.dailiesService.getDaily(dailyId);
    }

    @Get('/byDate/:year/:month/:day')
    getDailyByDate(
        @Param('year') year: number, 
        @Param('month') month: number, 
        @Param('day') day: number
        ) {
        return this.dailiesService.getDailyByDate(year, month, day);
    }

    @Patch('/:id')
    update(@Param('id') dailyId: number, @Body() dailyDate) {
        return this.dailiesService.update(dailyId, dailyDate);
    }

    @Delete('/:id')
    delete(@Param('id') dailyId: number) {
        return this.dailiesService.delete(dailyId);
    }
}

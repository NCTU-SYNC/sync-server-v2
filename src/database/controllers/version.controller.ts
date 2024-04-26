import { Controller, Get, Param, Post, Body, Put, Delete, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiQuery, ApiParam } from '@nestjs/swagger';
import { VersionService } from '../version.service';
import { Version } from '../schemas/version.schema';
import { Types } from 'mongoose';

@Controller('history')
export class VersionController {
    constructor(private readonly versionService: VersionService) {}

    @Get(':id')
    async findOneByArticleId(@Param('id') id: Types.ObjectId): Promise<Version> {
    return this.versionService.findOneByArticleId(new Types.ObjectId(id));
    }

    @Get(':id/compare')
    // @ApiOperation({
    //   summary: 'Compare versions of an article',
    //   description: 'Get a comparison of article versions based on version indexes',
    // })
    // @ApiParam({ name: 'id', description: 'Article ID' })
    // @ApiQuery({ name: 'start', required: true, description: 'Start version index' })
    // @ApiQuery({ name: 'end', required: true, description: 'End version index' })
    async compareVersions(
        @Param('id') id: Types.ObjectId,
        @Query('base') base: number,
        @Query('compare') compare: number,
    ): Promise<{ comparison: any[] }> {
        const articleVersions: Version = await this.versionService.findOneByArticleId(id);

        // if (base < 0 || compare < 0 || base >= articleVersions.versions.length || compare >= articleVersions.versions.length || base > compare) {
        //   throw new Error('Invalid start or end version indexes');
        // }

        if (!base && !compare) {
            compare = articleVersions.versions.length;
            base = compare - 1;
        }
        console.log("base:", base, "compare:", compare);

        const comparison = articleVersions.versions.slice(base - 1, compare);
        console.log(comparison)

        return { comparison };
    } 
}
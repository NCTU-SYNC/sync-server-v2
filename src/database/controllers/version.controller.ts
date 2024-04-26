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

    @Get('compare/:id')
    async getArticlesComparisonByVersionIndexes(
        @Param('id') id: Types.ObjectId,
        @Query('base') base: number,
        @Query('compare') compare: number,
    ): Promise<{ comparison: any[] }> {
        const articleVersions: Version = await this.versionService.findOneByArticleId(id);

        if (!base && !compare) {
            compare = articleVersions.versions.length;
            base = compare - 1;
        }

        const comparison = articleVersions.versions.slice(base - 1, compare);
        console.log(comparison)

        return { comparison };
    } 
}
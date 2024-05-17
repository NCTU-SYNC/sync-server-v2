import { Module } from '@nestjs/common';
import { VersionController } from '../controllers/version.controller';
import { VersionService } from '../version.service';
import { Version, VersionSchema } from '../schemas/version.schema';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
    imports: [
        MongooseModule.forFeature([{ name: Version.name, schema: VersionSchema }])
    ],
    controllers: [VersionController],
    providers: [VersionService],
})
export class VersionModule {}
import { FirebaseService } from '../../src/auth/firebase.service';
import { MODULE_OPTIONS_TOKEN } from '../../src/auth/firebase.module-definition';
import { Test, TestingModule } from '@nestjs/testing';

describe('FirebaseService', () => {
  let service: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FirebaseService,
        {
          provide: MODULE_OPTIONS_TOKEN,
          useValue: null,
        },
      ],
    }).compile();

    service = module.get<FirebaseService>(FirebaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(service.app).toBeDefined();
    expect(service.db).toBeDefined();
  });
});

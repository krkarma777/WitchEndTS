import { Test, TestingModule } from '@nestjs/testing';
import { GameCharactersService } from './game-characters.service';

describe('GameCharactersService', () => {
  let service: GameCharactersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameCharactersService],
    }).compile();

    service = module.get<GameCharactersService>(GameCharactersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

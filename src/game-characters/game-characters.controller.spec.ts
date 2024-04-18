import { Test, TestingModule } from '@nestjs/testing';
import { GameCharactersController } from './game-characters.controller';

describe('GameCharactersController', () => {
  let controller: GameCharactersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameCharactersController],
    }).compile();

    controller = module.get<GameCharactersController>(GameCharactersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});

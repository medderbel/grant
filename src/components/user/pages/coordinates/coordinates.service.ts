import { Inject, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { COORDINATE_PROVIDER } from 'src/config';
import { Coordinate } from 'src/common/mongoose/models/coordinates';
import { ICreateCoordinate } from 'src/common/interfaces/coordinate';

@Injectable()
export class CoordinateService {
  constructor(
    @Inject(COORDINATE_PROVIDER)
    private readonly CoordinateModel: Model<Coordinate>,
  ) {}
  async createCoordinate(payload: ICreateCoordinate): Promise<Coordinate> {
    return await this.CoordinateModel.create(payload);
  }
}

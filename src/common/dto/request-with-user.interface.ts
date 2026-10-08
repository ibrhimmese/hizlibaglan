// Express'in Request'ini genişletiyoruz
import { JwtPayloadDto } from './jwt-payload.dto';

import { Request } from 'express';

export interface RequestWithUser extends Omit<Request, 'user'> {
  user?: JwtPayloadDto | null;
}

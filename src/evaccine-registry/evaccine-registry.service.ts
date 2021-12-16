import { Injectable } from '@nestjs/common';
import { TrackedEntityInstanceFoundDto } from '../common/dtos/trackedEntityInstanceFound.dto';

@Injectable()
export class EvaccineRegistryService {
  async findTrackedEntityInstanceByPhoneNumber(
    phoneNumber: string,
  ): Promise<TrackedEntityInstanceFoundDto> {
    return null;
  }

  async findTrackedEntityInstanceByEpiNumber(
    epiNumber: string,
  ): Promise<TrackedEntityInstanceFoundDto> {
    return null;
  }
}

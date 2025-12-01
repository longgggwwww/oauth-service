import { IsArray, IsString, ArrayMinSize } from 'class-validator';

export class DeleteManyClientsRequest {
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1, { message: 'At least one client ID is required' })
  ids: string[];
}

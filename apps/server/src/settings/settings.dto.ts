import { IsString, IsNotEmpty } from 'class-validator';

export class SetSettingDto {
  @IsString({ message: 'Setting key must be a string' })
  @IsNotEmpty({ message: 'Setting key is required' })
  key: string;

  @IsString({ message: 'Setting value must be a string' })
  @IsNotEmpty({ message: 'Setting value is required' })
  value: string;
}

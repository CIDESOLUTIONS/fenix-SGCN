import { Module, Global } from '@nestjs/common';
import { FenixAdminClientService } from './fenix-admin-client.service';

@Global()
@Module({
  providers: [FenixAdminClientService],
  exports: [FenixAdminClientService]
})
export class FenixAdminClientModule {}

import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post('enterprise')
  async sendEnterpriseContact(@Body() data: any) {
    return this.contactService.sendEnterpriseEmail(data);
  }
}

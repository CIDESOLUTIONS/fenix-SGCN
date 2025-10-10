import { BiaCampaign as PrismaBiaCampaign } from '@prisma/client';

export class BiaCampaign implements PrismaBiaCampaign {
  id: string;
  tenantId: string;
  name: string;
  description: string | null;
  status: string;
  deadline: Date;
  targetProcesses: string[];
  completedCount: number;
  totalCount: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

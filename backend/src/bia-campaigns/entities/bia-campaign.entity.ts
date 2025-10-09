import { BIACampaign as PrismaBIACampaign } from '@prisma/client';

export class BIACampaign implements PrismaBIACampaign {
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

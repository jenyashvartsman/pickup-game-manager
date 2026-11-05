import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
import { AuditAction } from 'shared-types';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async log(
    entityType: string,
    entityId: string,
    action: AuditAction,
    description: string,
  ): Promise<void> {
    const entry = this.auditLogRepository.create({
      entityType,
      entityId,
      action,
      description,
    });
    await this.auditLogRepository.save(entry);
  }
}

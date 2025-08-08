import { DealStatus } from 'src/common/enum/dealStatus.enum';
import { Contact } from 'src/contacts/entity/contacts.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('deals')
export class DealEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: null })
  amoId: number | null;

  @Index()
  @Column()
  name: string;

  @Index()
  @Column({
    type: 'enum',
    enum: DealStatus,
    default: DealStatus.NEW,
  })
  status: DealStatus;

  @Column({ type: 'int', default: null })
  pipelineStageId: number | null;

  @ManyToMany(() => Contact, { cascade: false })
  @JoinTable({
    name: 'deal_contacts',
    joinColumn: { name: 'deal_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contact_id', referencedColumnName: 'id' },
  })
  contacts: Contact[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

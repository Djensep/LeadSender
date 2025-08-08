import { DealStatus } from 'src/common/enum/dealStatus.enum';
import { ContactsEntity } from 'src/contacts/entity/contacts.entity';
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
export class DealsEntity {
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

  @ManyToMany(() => ContactsEntity, { cascade: false })
  @JoinTable({
    name: 'deal_contacts',
    joinColumn: { name: 'deal_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'contact_id', referencedColumnName: 'id' },
  })
  contacts: ContactsEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

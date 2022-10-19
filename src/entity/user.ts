import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   BaseEntity,
   CreateDateColumn,
   UpdateDateColumn,
   JoinTable,
   ManyToMany,
   OneToMany,
} from 'typeorm'

@Entity()
export class user extends BaseEntity {
   @PrimaryGeneratedColumn()
   id: number

   @Column({ type: 'varchar', length: 256, nullable: false })
   name: string

   @Column({ type: 'varchar', length: 256, nullable: false })
   phone: string

   @Column({ type: 'varchar', enum: ['male', 'female'], nullable: false })
   gender: string

   @Column({ type: 'boolean', default: false })
   verified: boolean

   @CreateDateColumn({ type: 'timestamp' })
   createdAt: Date

   @UpdateDateColumn({ type: 'timestamp' })
   updatedAt: Date
}

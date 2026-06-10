import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  slug!: string;

  @Column()
  content!: string;

  @Column()
  excerpt!: string;

  @Column({ nullable: true })
  coverImageUrl!: string;

  @Column({ default: false })
  published!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  author!: User;
}

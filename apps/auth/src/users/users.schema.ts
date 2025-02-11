import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument, Subjects } from '@app/common';

@Schema({ collection: Subjects.USERS, versionKey: false, timestamps: true })
export class UsersDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  uType: string; // user type, like superadmin, partner, admin etc.

  @Prop({ required: true })
  roleId: string;

  @Prop({ type: [String], default: [] }) //history of parents
  ancestorIds: string[];

  @Prop()
  accountId: string;

  @Prop()
  partnerId: string;

  @Prop()
  refreshToken?: string;
}

export const UsersSchema = SchemaFactory.createForClass(UsersDocument);

AbstractDocument.applyHooks(UsersSchema);

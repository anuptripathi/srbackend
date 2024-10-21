import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({ versionKey: false, timestamps: true })
export class UsersDocument extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ required: true })
  uType: string; // user type, like superadmin, partner, admin etc.

  @Prop({ required: true })
  roleId: string;

  @Prop()
  accountId?: string;
}

export const UsersSchema = SchemaFactory.createForClass(UsersDocument);

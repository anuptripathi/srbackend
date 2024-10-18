import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { UserTypes } from '../user.types';

@Schema({ versionKey: false })
export class UsersDocument extends AbstractDocument {
  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  parent_id?: string; // user's owner_id

  @Prop()
  added_by?: string; // similar to parent_id/owner_id, but sometimes may be differ if someone/admin/moderator adds records on behalf of other user/owner.

  @Prop({ type: [String], default: [] }) // Ensure it's defined as an array
  ancestor_ids?: string[];

  @Prop({ required: true })
  u_type: string; // user type, like superadmin, partner, admin etc.
}

export const UsersSchema = SchemaFactory.createForClass(UsersDocument);

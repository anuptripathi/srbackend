import { Prop, Schema } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema()
export class AbstractDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ type: String })
  ownerId: string; // user's owner_id

  @Prop({ type: String })
  addedBy: string; // similar to parent_id/owner_id, but sometimes may be differ if someone/admin/moderator adds records on behalf of other user/owner.

  //@Prop({ type: [String], default: [] }) // Ensure it's defined as an array
  //ancestorIds: string[];

  @Prop({ type: String })
  accountId: string; // user's owner_id
}

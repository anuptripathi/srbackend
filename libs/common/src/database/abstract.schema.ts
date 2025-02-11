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

  @Prop({ type: String })
  partnerId: string; // user's owner_id

  static applyIndexes(schema: any) {
    // Add indexes for accountId, ownerId, and addedBy
    schema.index({ accountId: 1 });
    schema.index({ ownerId: 1 });
    schema.index({ addedBy: 1 });
  }

  static applyQueryHooks(schema: any) {
    // Add hooks for query logging
    schema.pre('find', function () {
      console.log('Executing query:');
      console.dir(this.getQuery(), { depth: null, colors: true });
    });

    schema.pre('findOne', function () {
      console.log('Executing query:');
      console.dir(this.getQuery(), { depth: null, colors: true });
    });

    schema.pre('save', function () {
      console.log('Saving document:', this);
    });
  }

  static applyHooks(schema: any) {
    this.applyIndexes(schema); // Apply indexes
    this.applyQueryHooks(schema); // Apply hooks
  }
}

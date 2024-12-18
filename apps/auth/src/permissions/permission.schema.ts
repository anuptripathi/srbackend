import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument, UserTypes, Actions, Subjects } from '@app/common';

@Schema({
  collection: Subjects.PERMISSIONS,
  timestamps: true,
  versionKey: false,
})
export class PermissionDocument extends AbstractDocument {
  @Prop()
  title: string;

  @Prop({ type: String, enum: Subjects })
  subject: Subjects;

  @Prop({ type: [String], enum: Actions })
  actions: Actions[];

  @Prop({ type: String, enum: UserTypes })
  uType: UserTypes;
}

export const PermissionSchema =
  SchemaFactory.createForClass(PermissionDocument);

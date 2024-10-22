import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';
import { Actions, Subjects } from '@app/common';

@Schema({ collection: Subjects.ROLES, timestamps: true, versionKey: false })
export class RoleDocument extends AbstractDocument {
  @Prop({ maxlength: 100 })
  name: string;

  @Prop({ maxlength: 200 })
  description: string;

  @Prop({
    type: [
      {
        title: String,
        subject: { type: String, enum: Subjects },
        actions: [{ type: String, enum: Actions }],
      },
    ],
  })
  permissions: {
    title: string;
    subject: Subjects;
    actions: Actions[];
  }[];
}

export const RoleSchema = SchemaFactory.createForClass(RoleDocument);

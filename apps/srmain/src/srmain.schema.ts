import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument, Subjects } from '@app/common';

@Schema({ collection: Subjects.TEST, versionKey: false, timestamps: true })
export class SrmainDocument extends AbstractDocument {
  @Prop()
  timestamp: Date;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  invoiceId: string;
}

export const SrmainSchema = SchemaFactory.createForClass(SrmainDocument);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument, Subjects } from '@app/common';

@Schema({ collection: Subjects.METRICS, versionKey: false, timestamps: true })
export class MetricsDocument extends AbstractDocument {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Date, required: true })
  timestamp: Date;

  @Prop({ type: Map, required: true })
  tags: Map<string, string>;

  @Prop({ type: Map, required: true })
  fields: Map<string, number>;
}

export const MetricsSchema = SchemaFactory.createForClass(MetricsDocument);

AbstractDocument.applyHooks(MetricsSchema);

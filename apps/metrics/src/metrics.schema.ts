import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument, Subjects } from '@app/common';

@Schema({ collection: Subjects.METRICS, versionKey: false, timestamps: true })
export class MetricsDocument extends AbstractDocument {
  @Prop({ type: String, required: true })
  host: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ required: true })
  timestamp: number;

  @Prop({ type: Map, required: true })
  tags: Map<string, string>;

  @Prop({ type: Map, required: true })
  fields: Map<string, number>;
}

export const MetricsSchema = SchemaFactory.createForClass(MetricsDocument);
// Define the composite index
MetricsSchema.index({ host: 1, name: 1, timestamp: -1 });

AbstractDocument.applyHooks(MetricsSchema);

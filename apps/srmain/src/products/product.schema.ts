import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument, Subjects } from '@app/common';

@Schema({
  collection: Subjects.PRODUCTS,
  timestamps: true,
  versionKey: false,
})
export class ProductDocument extends AbstractDocument {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;
}

export const ProductSchema = SchemaFactory.createForClass(ProductDocument);

AbstractDocument.applyHooks(ProductSchema);

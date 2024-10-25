import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '@app/common';

@Schema({
  collection: 'products',
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

ProductSchema.pre('find', function () {
  //console.log('Executing query:', this.getQuery(),{ depth: null, colors: true });
  console.log('Executing query:');
  console.dir(this.getQuery(), { depth: null, colors: true });
});
ProductSchema.pre('findOne', function () {
  console.log('Executing query:');
  console.dir(this.getQuery(), { depth: null, colors: true });
});
ProductSchema.pre('save', function () {
  console.log('Saving document:', this);
});

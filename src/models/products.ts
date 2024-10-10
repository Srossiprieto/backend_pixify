import mongoose, { Document, Schema } from 'mongoose';

interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: mongoose.Schema.Types.ObjectId;
  image: string;
}

const productSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  image: { type: String, required: true }
}, {
  timestamps: true
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
import mongoose, { Document, Schema } from 'mongoose';

interface ICategory extends Document {
  name: string;
  products: mongoose.Schema.Types.ObjectId[];
  
}

const categorySchema: Schema = new Schema({
  name: { type: String, required: true },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]

}, {
  timestamps: true
});

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
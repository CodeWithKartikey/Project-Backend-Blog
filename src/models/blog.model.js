// Import necessary modules

// Schema and model objects from Mongoose for MongoDB interactions
import { Schema, model } from "mongoose";

/*
    Blog Schema definition
*/
const blogSchema = new Schema(
    {
        thumbnail: {
            type: String
        },
        title : {
            type: String,
            required: [true, 'Title is required.'],
            maxLength: [100, 'Title should be less than 100 characters long.']
        },
        description: {
            type: String,
            required: [true, 'Description is required.'],
            maxLength: [1000, 'Description should be less than 1000 characters long.']
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    }, {timestamps: true}
);

/*
    Blog Model definition
*/
const blog = model('Blog', blogSchema);

// Exporting the blog object as the default export.
export default blog;
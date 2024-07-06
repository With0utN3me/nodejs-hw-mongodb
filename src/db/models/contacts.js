import { model, Schema } from 'mongoose';

const contactsSchema = new Schema (
    {
        name: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false,
            unique: true,
            validate: {
                validator: function (value) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                },
                message: 'Invalid email address format',
            },
        },
        isFavourite: {
            type: Boolean,
            default: false,
            required: false,
        },
        contactType: {
            type: String,
            enum: ['work', 'home', 'personal'],
            default: 'personal',
            required: false,
        },
        userId: { 
            type: Schema.Types.ObjectId, 
            ref: 'users',
            required: true,
        },
        photo: { type: String },
    },
    {
        timestamps: true,
        versionKey: false,
    },
);
export const ContactsCollection = model( "contacts", contactsSchema );
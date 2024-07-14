import createHttpError from 'http-errors';

import { ContactsCollection } from '../db/models/contacts.js';

export const checkUserId = async (req, res, next) => {
    const { user } = req;
    if (!user) {
        next(createHttpError(401));
        return;
    }
    const { contactId } = req.params;
    if (!contactId) {
        return next(createHttpError(400, 'Contact id is required'));
    }

    const contact = await ContactsCollection.findOne({
        _id: contactId,
    });

    if (!contact) {
        return next(createHttpError(404, 'Contact not found'));
    }

    if (contact.userId.toString() === user._id.toString()) {
        next();
        return;    
    }

        next(createHttpError(403));
};
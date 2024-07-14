import { ContactsCollection } from "../db/models/contacts.js";
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/index.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

export const getAllContacts = async ({
        userId,
        page = 1,
        perPage = 10,
        sortOrder = SORT_ORDER.ASC,
        sortBy = 'name',
        filter = {},
    }) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;
    const contactsQuery = ContactsCollection.find({ userId });

    if(filter.contactType){
        contactsQuery.where("contactType").equals(filter.contactType);
    };

    if(filter.isFavourite !== undefined){
        contactsQuery.where("isFavourite").equals(filter.isFavourite);
    };

    const [contactsCount, contacts] = await Promise.all([
        ContactsCollection.find().merge(contactsQuery).countDocuments(),

        contactsQuery
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .exec(),
    ]);

    const paginationData = calculatePaginationData(contactsCount, perPage, page);

    return {
        data: contacts,
        ...paginationData,
    };
};

export const getContactById = async (contactId) => {
    const contact = await ContactsCollection.findById(contactId); 
    return contact;
};

export const createContact = async (req) => {
    const photo = req.file;

    let photoUrl;

    if (photo) {
        if (env('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }
    const payload = {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isFavourite: req.body.isFavourite,
        contactType: req.body.contactType,
        userId: req.user._id,
        photo: photoUrl,
    };
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
    Object.keys(payload).forEach(key => (payload[key] === undefined || payload[key] === '') && delete payload[key]);
    const rawResult = await ContactsCollection.findOneAndUpdate(
        { _id: contactId },
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );
    
    if (!rawResult || !rawResult.value) return null;
    
    return {
        contact: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};

export const deleteContact = async (contactId) => {
    const contact = await ContactsCollection.findOneAndDelete({
        _id: contactId,
    });

    return contact;
};
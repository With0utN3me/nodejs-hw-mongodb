import Joi from 'joi';
export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(20).email(),
    isFavourite: Joi.boolean(),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal'),
    photo: Joi.string(),
}).unknown(true);

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).allow('').optional(),
    phoneNumber: Joi.string().min(3).max(20).allow('').optional(),
    email: Joi.string().min(3).max(20).email().allow('').optional(),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal').allow('').optional(),
    photo: Joi.string().allow('').optional(),
}).options({ stripUnknown: true });
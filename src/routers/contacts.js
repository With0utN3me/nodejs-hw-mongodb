import { Router } from "express";
import { getContactsController, getContactByIdController, createContactController, patchContactController, deleteContactController } from "../controllers/contacts.js";
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from "../validation/contacts.js";
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { checkUserId } from '../middlewares/checkUserId.js';

import { upload } from '../middlewares/multer.js';

const router = Router();
router.use(authenticate);

router.get('/', 
    ctrlWrapper(getContactsController)
);

router.get('/:contactId',
    checkUserId,
    ctrlWrapper(getContactByIdController)
);

router.post('/', 
    upload.single('photo'),
    validateBody(createContactSchema), 
    ctrlWrapper(createContactController)
);

router.patch('/:contactId', 
    checkUserId,
    upload.single('photo'),
    validateBody(updateContactSchema), 
    ctrlWrapper(patchContactController)
);

router.delete('/:contactId', 
    checkUserId,
    ctrlWrapper(deleteContactController)
);
export default router;

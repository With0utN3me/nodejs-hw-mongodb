import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { env } from './utils/env.js';

import { getAllContacts, getContactById } from './services/contacts.js';

const PORT = Number(env('PORT', '3000'));

export const setupServer = () => {
    const app = express();

    app.use(express.json());
    app.use(cors());

    app.use(
        pino({
        transport: {
            target: 'pino-pretty',
        },
        }),
    );

    app.get('/contacts', async (req, res) => {
        const students = await getAllContacts();

        res.status(200).json({
            message: "Successfully found contacts!",
            data: students,
        });
    });

    app.get('/contacts:contactId', async (req, res) => {
        const { contactId } = req.params;
        const contact = await getContactById(contactId);

        res.status(200).json({
            message: `Successfully found contact with id ${contactId}!`,
            data: contact,
        });
        res.status(404).json({
            message: 'Not found',
            });
    });

    app.use('*', (req, res) => {
        res.status(404).json({
        message: 'Not found',
        });
    });

    app.use((err, req, res) => {
        res.status(500).json({
        message: 'Something went wrong',
        error: err.message, 
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
    };
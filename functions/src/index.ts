import * as functions from 'firebase-functions';
import * as express from 'express';
import { addEntry,getAllEntries, updateEntry, deleteEntry } from './entryController';

const app = express();
app.get('/', (req, res) => res.status(200).send('Hey there! This is Aditya'));
app.post('/entriesa', addEntry);
app.get("/entriesa", getAllEntries);
app.patch("/entriesa/:entryId", updateEntry);
app.delete("/entriesa/:entryId", deleteEntry);
exports.app = functions.https.onRequest(app);
exports.getUrl = functions.https.onRequest(app);
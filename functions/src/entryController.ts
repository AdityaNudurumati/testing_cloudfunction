import {Response} from "express"
import {db} from "./config/firebase"
type EntryType = {
    title:string,
    text:string
}
//type EntryType = Record<string, any>; // Define EntryType as a dynamic object
type Request = {
    body:EntryType,
    params: {entryId: string}
}
const addEntry = async(req:Request,res:Response)=>{
    const {title,text}=req.body
    try{
        const entry = db.collection("entriesa").doc()
        const entryObject = {
            id:entry.id,
            title,
            text
        }
        entry.set(entryObject)
        res.status(200).send({
            status:"success",
            message:"entry added successfully",
            data:entryObject
        })
    }catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
const getAllEntries = async (req: Request, res: Response) => {
    try {
      const allEntries: EntryType[] = [];
      const querySnapshot = await db.collection("entriesa").get();
      querySnapshot.forEach((doc: any) => allEntries.push(doc.data()));
      return res.status(200).json(allEntries);
    } catch (error) {
      return res.status(500).json("We found an error fetching your request!");
    }
  };
  const updateEntry = async (req: Request, res: Response) => {
    const {body: {text, title}, params: {entryId}} = req;
  
    try {
      const entry = db.collection("entriesa").doc(entryId);
      const currentData = (await entry.get()).data() || {};
      const entryObject = {
        id:entryId, //...currentData,
        title: title || currentData.title,
        text: text || currentData.text,
      };
  
      await entry.set(entryObject).catch((error) => {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      });
  
      return res.status(200).json({
        status: "success",
        message: "entry updated successfully",
        data: entryObject,
      });
    } catch (error) {
      return res.status(500).json("We found an error updating an entry!");
    }
  };
  const deleteEntry = async (req: Request, res: Response) => {
    const {entryId} = req.params;
  
    try {
      const entry = db.collection("entriesa").doc(entryId);
      await entry.delete().catch((error) => {
        return res.status(400).json({
          status: "error",
          message: error.message,
        });
      });
  
      return res.status(200).json({
        status: "success",
        message: "entry deleted successfully",
      });
    } catch (error) {
      return res.status(500).json("We found an error deleting an entry");
    }
  };
export {addEntry, getAllEntries, updateEntry, deleteEntry};
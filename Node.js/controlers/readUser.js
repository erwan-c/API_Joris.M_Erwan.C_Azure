import User from "../models/user.js";

  export async function readUser (req, res)  {
    try 
    {
        const users = await User.find({});
        res.status(200).send(users);    
    } catch (error) 
    {
      console.log(error);
      res.sendStatus(500);
    }
  };
  

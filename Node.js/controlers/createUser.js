import User from "../models/user.js";
import * as yup from "yup";
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
    const param = yup.object().shape({
      email: yup.string().email().required(),
      pseudo: yup.string().required(),
      password: yup.string().required(),
      priv: yup.boolean().required(),
    });
    let test = await param.isValid(req.body)
    
    try 
    {
      if (test)
      {
        var { email, pseudo, password, priv } = req.body;
        
        
            const nbtours = 10;
            password = bcrypt.hashSync(password, nbtours);

            const newUser = new User({ email, pseudo, password, priv });
            const savedUser = await newUser.save();
            res.status(201).send(savedUser);
                 
      }
      else
      {
        res.status(404).send('Vos informations entrées sont incorrectes ');
      }
      
    } catch (error) 
    {
      console.log(error);
      res.sendStatus(500);
    }
  };
  export default createUser;
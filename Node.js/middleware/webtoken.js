
import jwt from "jsonwebtoken";


  const webtoken = async (req, res, next) => {
    const verif = req.cookies.webtoken;
    if (!verif)
    {
      return res.status(401).send('Votre accès a été refusé');
    }
   
    try 
    {
      const decoded = await jwt.verify(verif, 'config');
      req.user = decoded;
      next();
    }
    
     catch (error) 
     {
      console.error(error);
      res.status(400).send('Votre token est invalide');
    }
  };
  
  export default webtoken;
  
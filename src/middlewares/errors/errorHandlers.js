import Errors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
    console.log(error.message);

    if(error.code === Errors.MISSING_REQUIRED_FIELDS){
        res.status(400).send({ message: "Error", error: error.name});
     }else{
        res.status(500).send({ message: "Error", error: "Unhandled error"});
     }
}
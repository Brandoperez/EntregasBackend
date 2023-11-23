import Errors from "../../services/errors/enums.js";
import Logger  from "../../utils/logger.js";

export default (error, req, res, next) => {
    Logger.error(error.message);

    if(error.code === Errors.MISSING_REQUIRED_FIELDS){
        res.status(400).send({ message: "Error", error: error.name});
     }else{
        res.status(500).send({ message: "Error", error: "Unhandled error"});
     }
}
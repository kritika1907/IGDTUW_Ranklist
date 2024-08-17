const FORMAT = require("pg-format");
const DBCONST = require("./query_utils/DbConstants");
const { SELECT_FUNC_WITHOUT_COLUMN_QUERY } = require("./query_utils/SelectFunctionQueryFormat");

module.exports = {
    GetRankingsQuery: (batch, sem) => {
        global.log("info", global.messages.METHOD_LOG_IN);
    
        let paramStr = `'${batch}', '${sem}'`;
    
        /* Preparing the query */
        // arg1: query format
        // arg2: target fields
        // arg3: prepared parameter string
        let preparedQuery = FORMAT(
          SELECT_FUNC_WITHOUT_COLUMN_QUERY,
          DBCONST.DB_FUNCTION_NAME.RANKINGS_LIST,
          paramStr
        );
    
        /* Returning the prepared query */
        global.log("info", global.messages.METHOD_LOG_OUT);
        return preparedQuery;
      }
}
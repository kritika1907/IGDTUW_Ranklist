
let searchResult = require("../data_access/database/SearchResult");

module.exports = {
    
    SearchResult : async (batch, sem) => {
        
        try { 
            let result = await searchResult.GetRankingsDetails(batch,sem);
            if (result && result.rowCount > global.constants.ONE) {
                return { success : true, result: result.rows};
            }else{
                return { success : false, message : global.messages.NO_RECORDS_EXSISTS };
            }
            
        } catch (error) {
            global.log("error", error.message);
            return { success : false, message : `${error.message}` };
        }
    }
};

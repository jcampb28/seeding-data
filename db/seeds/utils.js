const db = require("../../db/connection");


exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

// exports.formatterFunc = (arrOfData) => {
//   const formattedData = arrOfData.map((data) => {
//     const arrToReturn = [];
//     for (const key in data) {
//       if (key === "created_at") {
//         const convertedDate = convertTimestampToDate(data)
//         arrToReturn.push(convertedDate[key])
//       }
//       else {
//         arrToReturn.push(data[key])

//       }
//     }    
//     return arrToReturn
//   })
//   console.log(formattedData)
//   return formattedData
// }

// convertTimestampToDate not a function error received in tests


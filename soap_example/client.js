var soap = require('soap');
var url = "http://localhost:3030/bmicalculator?wsdl";
var args = {weight:65.7,height:1.63};
soap.createClient(url,function(err,client){
  if(err)
    console.error(err);
  else {
    client.calculateBMI(args,function(err,response){
      if(err)
        console.error(err);
      else {
        console.log(response);
      }
    })
  }
});
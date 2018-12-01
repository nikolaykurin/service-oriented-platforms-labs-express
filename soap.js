import soap from 'soap';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import { SOAP_PORT } from './config';

const app = express();

app.use(cors());
app.options('*', cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var service = {
  BMI_Service: {
    BMI_Port: {
      calculateBMI: (args) => {
        const n = (args.weight) / (args.height * args.height);
        console.log(n);
        return {
          bmi: n
        };
      }
    }
  }
};

// xml data is extracted from wsdl file created
var xml = fs.readFileSync('./bmicalculator.wsdl', 'utf8');
//create an express server and pass it to a soap server
var server = app.listen(SOAP_PORT, () => console.log('Server Started!'));

soap.listen(server, '/bmicalculator', service, xml);

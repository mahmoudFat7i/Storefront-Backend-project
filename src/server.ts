import express, { Request, Response, Application } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/users';
import productRoutes from './handlers/producte';
import orderRoutes from './handlers/orders';

const app: Application = express();
const address = '0.0.0.0:3000';
app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
  res.sendFile(__dirname + '/views/index.html');
});

//app.Method takes two parameters, URI and callback function
//callback function takes request and response objects as parameters
app.get('/', async (req: Request, res: Response): Promise<void> => {
  res.sendFile(__dirname + '/views/index.html');
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

//use this function to map your app to a port
app.listen(3000, () => {
  const msg: string = 'starting app on:' + address;
  console.log(msg);
});

export default app;

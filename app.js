const express = require('express');
const morgan = require('morgan')
const rateLimit = require('express-rate-limit');
const mongosanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const path = require('path');


const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

//1) GLOBAL MIDDLEWARES

/* Method to excess static files from folder not using routes */
// app.use(express.static(`${__dirname}/public`))
app.use(express.static(path.join(__dirname, 'public')))

//Set security HTTP headers
app.use(helmet());
console.log(process.env.NODE_ENV);
// Development logging
if (process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
//This middleware used to restrict IP from being multiple request or Denial network or Brute Force
//Limit requests from same API
const limiter = rateLimit({
    max:100,
    windowMs: 60 * 60*1000,
    message: 'Too many requests from this IP, Please try again in an hour!'
});
app.use('/api',limiter )

//Body Parser, reading data from body into req.body
app.use(express.json({limit: '10kb'}));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongosanitize());

//Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp({
    whitelist: ['duration','ratingsQuantity','ratingsAverage','maxGroupSize','difficulty','price']
}))


app.use((req, res, next) => {
    console.log('Hello from the middleware 👏');
    next();
});
app.use(compression());
//Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});
// app.get('/', (req, res) => {
//     res.status(200).json({message:'Hello', app: 'natours'});
// });

// app.post('/', (req, res) => {
//     res.send('You can post to this endpoint')
// })


/*********************************/
/* THESE ALL FILES SPERATED IN THE SEPERATE FOLDER  */

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
// );

// const getAllTours =  (req, res) => {
//     console.log(req.requestTime);
//     res.status(200).json({
//         status: 'success',
//         requestAt : req.requestTime,
//         results : tours.length,
//         data : {
//             tours
//         }
//     });
// }
// const getTours = (req, res) => {
//     console.log(req.params);
//     const id = req.params.id *1;
//     const tour = tours.find(el => el.id === id);

//     // if (id > tours.length) {
//         if(!tour){
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Invalid ID'
//             });
//     }

//     res.status(200).json({
//         status: 'success',
//         data : {
//             tour
//         }
//     });
// }
// const createTours = (req, res) => {
//     const newId = tours[tours.length - 1].id + 1;
//     const newTours = Object.assign({id : newId}, req.body);
//     console.log(req.body);
//     tours.push(newTours);
//     fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
//         res.status(201).json({
//             status : 'success', data: {tours: newTours}
//         })
//     });
// }
// const updateTours = (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//            return res.status(404).json({
//            status: 'error',
//            message: 'Invalid ID'
//        });
//        }
   
//        res.status(200).json({status:'success',
//        data:{
//            tour: '<Updated tour here.....>'
//        }
//        })
//    }
// const deleteTour = (req, res) => {
//     if (req.params.id * 1 > tours.length) {
//            return res.status(404).json({
//            status: 'error',
//            message: 'Invalid ID'
//        });
//        }
   
//        res.status(204).json({status:'success',
//        data:null
//        })
//    }

// // USERS DATA
// const allUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not yet defined'
//     });
// }
// const createUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not yet defined'
//     });
// }
// const getUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not yet defined'
//     });
// }
// const updateUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not yet defined'
//     });
// }
// const deleteUsers = (req, res) => {
//     res.status(500).json({
//         status: 'error',
//         message: 'Not yet defined'
//     });
// }

//ROUTING

// app.get('/api/v1/tours',getAllTours)
// app.post('/api/v1/tours', createTours)
// app.get('/api/v1/tours/:id',getTours)
// app.patch('/api/v1/tours/:id', updateTours)
// app.delete('/api/v1/tours/:id', deleteTour)

// app.route('/api/v1/tours').get(getAllTours).post(createTours)
// app.route('/api/v1/tours/:id').get(getTours).patch(updateTours).delete(deleteTours)

//USER ROUTING
// app.route('/api/v1/users').get(allUsers).post(createUsers)
// app.route('/api/v1/users/:id').get(getUsers).patch(updateUsers).delete(deleteUsers)

/**********
FILTERING THE rOUTES TO OTHER FILES
 */
// On using Mounting
/* Mounting the Route */
// const tourRouter = express.Router();
// const userRouter = express.Router();

// tourRouter.route('/').get(getAllTours).post(createTours)
// tourRouter.route('/:id').get(getTours).patch(updateTours).delete(deleteTour)

// //USER ROUTING
// userRouter.route('/').get(allUsers).post(createUsers)
// userRouter.route('/:id').get(getUsers).patch(updateUsers).delete(deleteUsers)

//3) ROUTES

app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews',reviewRouter)
app.use('/api/v1/booking', bookingRouter)

app.all('*',(req, res, next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on this server`
    // })
    // const err = new Error(`Can't fin ${req.originalUrl} on this server`)
    // err.status = 'fail';
    // err.statusCode = 404;
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler)
module.exports = app
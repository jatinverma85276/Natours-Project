const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');
const router = express.Router();

// router.param('id', (req,res,next, val) => {
//   console.log('Tour id is : ${val}');
// });

/* Need this param midddleware to check id when we use json file instead of database */
// router.param('id', tourController.checkID)

// POST /tour/2611vx561vf5/reviews
// GET /tour/2611vx561vf5/reviews
// POST /tour/2611vx561vf5/review/26xf4vb54

// router
//     .route('/:tourId/reviews')
//     .post(authController.protect,
//       authController.restrictTo('user'),
//       reviewController.createReview)

router.use('/:tourId/reviews', reviewRouter)

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(tourController.getToursWithin);
// /tours-within?distance=233&center=-40,45&unit=mi
// /tours-within/233/center/-40,45/unit/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour
  )
  .delete(authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.deleteTour
  );

module.exports = router;

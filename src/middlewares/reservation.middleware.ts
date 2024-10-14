import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

// Validation chain array
const newReservationValidator = [
  body('date')
    .exists({ checkFalsy: true })
    .isISO8601()
    .toDate()
    .withMessage('Date must be a valid ISO 8601 date'),

  body('madeBy')
    .exists({ checkFalsy: true })
    .isMongoId()
    .withMessage('MadeBy must be a valid MongoDB ObjectId'),

  body('store')
    .exists({ checkFalsy: true })
    .isMongoId()
    .withMessage('Store must be a valid MongoDB ObjectId'),

  body('table')
    .exists({ checkFalsy: true })
    .isMongoId()
    .withMessage('Table must be a valid MongoDB ObjectId'),

  body('diners')
    .isArray({ min: 1 })
    .withMessage('Diners must be an array and cannot be empty')
    .custom((diners: string[]) => {
      if (!diners.every(diner => typeof diner === 'string' && diner.match(/^[0-9a-fA-F]{24}$/))) {
        throw new Error('Each diner must be a valid User ObjectId');
      }
      return true;
    }),

  // Middleware to check the validation result
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    } else {
      next();
    }
  }
];

export { newReservationValidator }
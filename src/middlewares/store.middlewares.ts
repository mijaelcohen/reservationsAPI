import { query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation chain array
const availableStoreValidator = [
  query('preferences')
    .optional()
    .isString()
    .withMessage('Preferences must be a string')
    .customSanitizer((value) => {
      if (value) {
        return value.split(',');
      }
      return []
    }),

  query('diners')
    .exists()
    .isInt({ min: 1 })
    .withMessage('Diners must be a positive integer')
    .toInt(),

  query('date')
    .exists()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date')
    .toDate(),
  // actual middleware
  (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).send({ errors: errors.array() });
      }
      next();
    }
];

const availableTableValidator = ()=>{
  const copy = [...availableStoreValidator.slice(1)]
  copy.unshift(
    query('store')
    .exists({ checkFalsy: true })
    .isMongoId()
    .withMessage('Store must be a valid MongoDB ObjectId'),
  )
  
  return copy
}

export { availableStoreValidator, availableTableValidator }
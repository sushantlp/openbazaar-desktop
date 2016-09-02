import app from '../../app';
import BaseModel from '../BaseModel';
import is from 'is_js';

export default class extends BaseModel {
  defaults() {
    return {
      currencyCode: app.settings && app.settings.get('localCurrency') || 'USD',
    };
  }

  // todo: validate currencyCode is one of the valid codes from currency module
  validate(attrs) {
    const errObj = {};
    const addError = (fieldName, error) => {
      errObj[fieldName] = errObj[fieldName] || [];
      errObj[fieldName].push(error);
    };

    if (attrs.amount === '') {
      addError('amount', 'Please provide a price.');
    } else if (is.not.number(attrs.amount)) {
      addError('amount', 'Please provide the price amount as a number.');
    } else if (attrs.amount <= 0) {
      addError('amount', 'The price must be greater than 0.');
    }

    if (!attrs.currencyCode) {
      addError('currencyCode', 'Please provide a currency code.');
    }

    if (Object.keys(errObj).length) return errObj;

    return undefined;
  }

  /**
   * Converts the price amount from a decimal to an integer. If the
   * currency code is BTC, it will also convert to Satoshi.
   */
  static convertPriceOut(price) {
    if (is.not.object(price)) {
      throw new Error('Please provide a price object.');
    }

    if (typeof price.amount === 'number') {
      if (price.currencyCode === 'BTC') {
        price.amount = Math.round(price.amount * 1000000000);
      } else {
        price.amount = Math.round(price.amount * 100);
      }
    }

    return price;
  }

  /**
   * Converts the price amount from an integer to a decimal. If the
   * currency code is BTC, it will also convert from Satoshi to BTC.
   */
  static convertPriceIn(price) {
    if (is.not.object(price)) {
      throw new Error('Please provide a price object.');
    }

    if (typeof price.amount === 'number') {
      if (price.currencyCode === 'BTC') {
        price.amount = Number((price.amount / 1000000000).toFixed(2));
      } else {
        price.amount = Number((price.amount / 100).toFixed(2));
      }
    }

    return price;
  }
}

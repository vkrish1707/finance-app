const _ = require('lodash');

const convertKeysToCamelCase = (obj) => {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    const camelCaseKey = _.camelCase(key);
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
      newObj[camelCaseKey] = convertKeysToCamelCase(obj[key]);
    } else {
      newObj[camelCaseKey] = obj[key];
    }
  });

  return newObj;
};

// Example usage:
const inputObj = {
  'first_name': 'John',
  'last_name': 'Doe',
  'email_address': 'john.doe@example.com',
  'address': {
    'street_address': '123 Main St',
    'city_name': 'Anytown',
    'postal_code': '12345'
  }
};

const outputObj = convertKeysToCamelCase(inputObj);
console.log(outputObj);

/* eslint-disable valid-jsdoc */
const helpers = {
  /**
   * @description This method helps validate passwords.
   * @param  {string} password The password you are trying to validate
   * @retxurns {object} Contains valid (bool) and invalidMessages (array[strings])
   */
  validPassword: password => {
    let valid = true;
    const invalidMessages = [];
    // Password cant be empty

    // Check that length is greater or equal to 8
    if (password.trim().length < 8) {
      valid = false;
      invalidMessages.push('Password should be more than 8 characters');
    }

    // Check that at least one character is upper or lowercase
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
      valid = false;
      invalidMessages.push(
        'Password must include at least one uppercase and lowercase character'
      );
    }

    return {
      valid,
      invalidMessages
    };
  },
  /**
   * @description This method checks the date the password
   * was updated and compares it to the date in the token
   * @param  {string} currentDate
   * @param  {string} tokenDate
   * @returns {boolean} A boolean representing if the token is still valid or not
   */
  compareDate: (currentDate, tokenDate) =>
    new Date(currentDate).getTime() === new Date(tokenDate).getTime(),

  /**
   * @description This method checks if an object contains a number of properties
   * @param  {object} obj The object to be searched
   * @param  {array} params The list of properties to be searched for
   * @returns {object} An object that contains a valid (bool) and invalidMessages (array) property
   */
  checkProps: (obj, ...params) => {
    let valid = true;
    const invalidMessages = [];

    params.forEach(property => {
      if (!obj[property]) {
        valid = false;
        invalidMessages.push(`Please provide ${property}`);
      }
    });

    return {
      valid,
      invalidMessages
    };
  }
};

export default helpers;

const helpers = {
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

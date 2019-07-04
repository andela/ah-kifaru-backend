export default {
  stripNull(dirtyObj) {
    let cleanObj = {};

    Object.keys(dirtyObj).forEach(key => {
      const newVal = dirtyObj[key];
      cleanObj = newVal ? { ...cleanObj, [key]: newVal } : cleanObj;
    });

    return cleanObj;
  }
};

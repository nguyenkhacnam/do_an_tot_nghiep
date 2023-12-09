const validateEmail = function (email) {
    const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  };

const isEmpty = (val) => {
    return (val === undefined || val == null || val.length <= 0) ? true : false;
}
  
  module.exports = { validateEmail,isEmpty };
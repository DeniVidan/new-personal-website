// validateEmail.js
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  }
  
  module.exports = { validateEmail };
  
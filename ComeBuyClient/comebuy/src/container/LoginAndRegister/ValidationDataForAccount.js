import validator from 'validator'

//Validate password if it's false then it's false
export function CheckPassword(password) {
  // ít nhất một số, một chữ thường và một chữ hoa
  var re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/;
  return re.test(password);
};

//validation username if it's true then it's wrong
export function CheckUsername(username) {
  var format = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

  if (format.test(username)) {
    return true;
  } else {
    return false;
  }
}

//Validation email
export function CheckEmail(mail) {
  if (validator.isEmail(mail)) {
    return true;
  } else {
    return false
  }
}

//validation phone number
export function CheckPhoneNumber(contact) {
  var phoneno = /^[0-9]{10,11}$/;
  if (phoneno.test(contact)) {
    return true;
  }
  else {
    return false;
  }
}
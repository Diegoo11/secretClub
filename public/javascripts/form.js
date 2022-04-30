const exp = /\..+/gm
const inputs = document.querySelectorAll('input')

inputs.forEach((input) => input.addEventListener('blur', () => {
  validator(input)
}));

inputs.forEach((input) => input.addEventListener('input', () => {
  input.setCustomValidity('')
}));

function showError(input) {
  if (input.validity.typeMismatch) {
    input.setCustomValidity('El texto ingresado no coinside con un correo');
    input.reportValidity();
  } else if (input.validity.valueMissing) {
    input.setCustomValidity('Porfavor ingresa un valor, el formulario no puede quedar vacio');
    input.reportValidity();
  } else {
    input.setCustomValidity('');
  }
};

function validator(input) {
  const test = exp.test(input.value)
  if(!input.validity.valid){
    showError(input)
  }
  if (input.type === 'email') {
    if(!test) {
      console.log('falta el .com')
      input.setCustomValidity('falta el.com');
      input.reportValidity();
    }
  }
}

document.querySelector('form') ? document.querySelector('form').addEventListener('submit', (e) => {
  const password1 = document.getElementById('password')
  const password2 = document.getElementById('password2')
  inputs.forEach((input) => {
    if(!input.validity.valid){
      e.preventDefault()
      showError(input)
    }
  })
  if(!(password1.value === password2.value)){
    e.preventDefault()
    password2.setCustomValidity('Tu contrasena debe coincidir con la esatablecida previamente');
    password2.reportValidity();
  }
}) : '';
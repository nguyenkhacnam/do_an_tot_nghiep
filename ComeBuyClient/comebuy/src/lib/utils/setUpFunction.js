export default function SetUpFunction() {
    if (localStorage.getItem('cart') === 'undefined' || localStorage.getItem('cart') === null) {
        localStorage.setItem('cart', JSON.stringify([]))
      }
      if (localStorage.getItem('accessToken') === 'undefined' || localStorage.getItem('accessToken') === null) {
        localStorage.setItem('accessToken', 'none')
      }
      if (localStorage.getItem('role') === 'undefined' || localStorage.getItem('role') === null) {
        localStorage.setItem('role', '')
      }
      if (localStorage.getItem('idUser') === 'undefined' || localStorage.getItem('idUser') === null) {
        localStorage.setItem('idUser', '')
      }
}


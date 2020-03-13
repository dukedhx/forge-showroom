import { createContext } from 'react'
export default createContext({
  alert: message => alert(message),
  dialogue: message => confirm(message),
  notify: message => alert(message)
})

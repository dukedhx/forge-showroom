import { createContext } from 'react'
type Layout = {
  maxWidth: false | 'lg' | 'xs' | 'sm' | 'md' | 'xl'
  background: string
}
const layout: Layout = { maxWidth: 'lg', background: 'rgba(255,255,255,0.8)' }
export default createContext({
  layout
})

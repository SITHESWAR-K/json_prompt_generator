import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

import Jsonprompt from './jsonprompt.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Jsonprompt />
  </StrictMode>,
)

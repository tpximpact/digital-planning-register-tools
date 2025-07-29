import { APITester } from './APITester'
import { ExampleComponent } from '@dpr/ui/components'
import './app.css'
import icon from '../assets/icon.svg'

export function App() {
  return (
    <div className="app">
      <div className="logo-container">
        <img src={icon} alt="Bun Logo" className="logo bun-logo" />
      </div>

      <h1>Bun + React</h1>
      <ExampleComponent name={`from the ui package to the react-app package`} />
      <p>
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
      <APITester />
    </div>
  )
}

export default App

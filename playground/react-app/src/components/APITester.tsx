import { useRef, type FormEvent } from 'react'

export function APITester() {
  const responseInputRef = useRef<HTMLTextAreaElement>(null)

  const testEndpoint = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const form = e.currentTarget
      const formData = new FormData(form)

      const application = formData.get('application') as string
      let baseUrl = location.href
      switch (application) {
        case 'react-app':
          baseUrl = location.href
          break
        case 'dpr-api':
          baseUrl = 'http://localhost:4000'
          break
      }
      const endpoint = formData.get('endpoint') as string

      // console.log(baseUrl);
      // console.log(endpoint);
      const url = new URL(endpoint, baseUrl)

      // console.log(url);
      const method = formData.get('method') as string

      const res = await fetch(url, { method })

      const data = (await res.json()) as Record<string, unknown>
      if (responseInputRef.current) {
        responseInputRef.current.value = JSON.stringify(data, null, 2)
      }
    } catch (error) {
      if (responseInputRef.current) {
        responseInputRef.current.value = String(error)
      }
    }
  }

  return (
    <div className="api-tester">
      <form onSubmit={testEndpoint} className="endpoint-row">
        <select name="application" className="method">
          <option value="react-app">react-app</option>
          <option value="dpr-api">dpr-api</option>
        </select>
        <select name="method" className="method">
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
        </select>
        <input
          type="text"
          name="endpoint"
          defaultValue="/api/hello"
          className="url-input"
          placeholder="/api/hello"
        />
        <button type="submit" className="send-button">
          Send
        </button>
      </form>
      <textarea
        ref={responseInputRef}
        readOnly
        placeholder="Response will appear here..."
        className="response-area"
      />
    </div>
  )
}

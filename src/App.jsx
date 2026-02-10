import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [number, setNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showExplosion, setShowExplosion] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [progress, setProgress] = useState(0)
  const [loadingText, setLoadingText] = useState('reading your mind....')
  const [resultMessage, setResultMessage] = useState('')
  const [showHiddenMessage, setShowHiddenMessage] = useState(false)
  const keySequenceRef = useRef([])

  const loadingMessages = [
    'reading your mind....',
    'reading your moms mind....',
    'reading nothing at this point'
  ]

  const resultMessages = [
    'you are gay'
  ]

  // Listen for key sequence "1234" and "4321"
  useEffect(() => {
    const handleKeyPress = (e) => {
      const key = e.key
      
      // Only track number keys
      if (key >= '0' && key <= '9') {
        keySequenceRef.current.push(key)
        
        // Keep only last 4 keys
        if (keySequenceRef.current.length > 4) {
          keySequenceRef.current.shift()
        }
        
        // Check for "1234"
        if (keySequenceRef.current.join('') === '1234') {
          setShowHiddenMessage(true)
        }
        
        // Check for "4321"
        if (keySequenceRef.current.join('') === '4321') {
          setShowHiddenMessage(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  const handleReadMind = () => {
    if (!number) return
    
    // Pick a random result message
    const randomMessage = resultMessages[Math.floor(Math.random() * resultMessages.length)]
    setResultMessage(randomMessage)
    
    setIsLoading(true)
    setShowExplosion(false)
    setShowResult(false)
    setProgress(0)
    setLoadingText(loadingMessages[0])

    let messageIndex = 0

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2
        
        // Change text based on progress
        if (newProgress >= 33 && messageIndex === 0) {
          messageIndex = 1
          setLoadingText(loadingMessages[1])
        } else if (newProgress >= 66 && messageIndex === 1) {
          messageIndex = 2
          setLoadingText(loadingMessages[2])
        }
        
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsLoading(false)
          setShowExplosion(true)
          
          // Show result after explosion animation
          setTimeout(() => {
            setShowResult(true)
          }, 1500)
          
          return 100
        }
        return newProgress
      })
    }, 150)
  }

  const handleReset = () => {
    setNumber('')
    setIsLoading(false)
    setShowExplosion(false)
    setShowResult(false)
    setProgress(0)
    setLoadingText(loadingMessages[0])
  }

  return (
    <div className="app">
      <h1 className="title">Pick any number you want, I will read your mind</h1>
      
      <div className="input-container">
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="Enter a number"
          disabled={isLoading || showResult}
          className="number-input"
        />
      </div>

      <button
        onClick={handleReadMind}
        disabled={isLoading || showResult || !number}
        className="read-button"
      >
        Read my Mind
      </button>

      {isLoading && (
        <div className="loading-container">
          <div className="loading-bar">
            <div className="loading-progress" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="loading-text">{loadingText}</p>
        </div>
      )}

      {(showExplosion || showResult) && (
        <div className="result-container">
          {showResult && (
            <>
              <h2 className="result-text">
                {resultMessage}
              </h2>
              <button onClick={handleReset} className="reset-button">
                Try Again
              </button>
            </>
          )}
          {showExplosion && (
            <div className="explosion-container">
              <div className="explosion"></div>
            </div>
          )}
        </div>
      )}

      {showHiddenMessage && (
        <div className="hidden-message">
          <h2 className="result-text">you are gay</h2>
        </div>
      )}
    </div>
  )
}

export default App

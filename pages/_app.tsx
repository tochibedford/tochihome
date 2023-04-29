import ErrorBoundary from '@components/ErrorBoundary'
import Footer from '@components/footer'
import Navbar from '@components/navbar'
import '@styles/globals.scss'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const location = useRouter()
  const [currentOpacity, setCurrentOpacity] = useState(1)

  useEffect(() => {
    setCurrentOpacity(1)
    setTimeout(() => {
      setCurrentOpacity(0)
    }, 1000)


  }, [Component])
  return (
    <>
      <div className="noiseFilter"></div>
      <div style={{ opacity: 1 - currentOpacity }} >

        <Navbar />
        <ErrorBoundary fallback={<div>There was an Error Loading this page</div>}>
          <Component {...pageProps} />
        </ErrorBoundary>
        <Footer />
      </div>
      <video src="./vhs.mp4" playsInline muted autoPlay loop className="vhsFilter" />
      <video src="./vhsOptim.mp4" playsInline muted autoPlay loop className="vhsFilter" />
      <video src="./vhsOptim2.mp4" playsInline muted autoPlay loop className="vhsFilter reducedVisibility" />
      {/* <div className={styles.}> */}
      <video src="./lightLeak.mp4" style={{ opacity: currentOpacity }} playsInline muted autoPlay loop className="vhsFilter transitionLightLeak" />
      {/* </div> */}
    </>
  )
}

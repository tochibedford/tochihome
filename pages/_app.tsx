import ErrorBoundary from '@components/ErrorBoundary'
import Footer from '@components/footer'
import Navbar from '@components/navbar'
import '@styles/globals.scss'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function App({ Component, pageProps }: AppProps) {
  const location = useRouter()
  const transitionVidRef = useRef<HTMLVideoElement>(null)

  return (
    <>
      <div className="noiseFilter"></div>
      <Navbar />
      <AnimatePresence mode='wait' initial={false}>
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1 } }}
          exit={{ opacity: 0 }}

          onTap={() => {
            if (transitionVidRef.current) {
              transitionVidRef.current.currentTime = 0
            }
          }}
        >
          <ErrorBoundary fallback={<div>There was an Error Loading this page</div>}>
            <Component {...pageProps} />
          </ErrorBoundary>
        </motion.div>
        <motion.div
          key={location.pathname + "newKey"}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, transition: { duration: 0.9 } }}
          exit={{ opacity: 1 }}
        >
          <video src="./lightLeak.mp4" ref={transitionVidRef} playsInline muted autoPlay loop className="vhsFilter transitionLightLeak" />
        </motion.div>
      </AnimatePresence>
      <video src="./vhs.mp4" playsInline muted autoPlay loop className="vhsFilter" />
      <video src="./vhsOptim.mp4" playsInline muted autoPlay loop className="vhsFilter" />
      <video src="./vhsOptim2.mp4" playsInline muted autoPlay loop className="vhsFilter reducedVisibility" />
      <Footer />
    </>
  )
}

import ErrorBoundary from '@components/ErrorBoundary'
import Footer from '@components/footer'
import Navbar from '@components/navbar'
import '@styles/globals.scss'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <ErrorBoundary fallback={<div>Error</div>}>
        <Component {...pageProps} />
      </ErrorBoundary>
      {/* <Footer /> */}
    </>
  )
}

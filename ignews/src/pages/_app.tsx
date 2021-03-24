import { AppProps } from 'next/app';
import { Heaader } from '../components/Header';
import '../styles/global.scss';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Heaader />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp

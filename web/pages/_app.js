import 'tailwindcss/tailwind.css'
import { CartProvider } from '../context/cartContext'
import '../public/styles/Modal.css'
import '../public/owl_speech_bubble/speech_bubble.css'


function MyApp({ Component, pageProps })
{
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  )
}

export default MyApp

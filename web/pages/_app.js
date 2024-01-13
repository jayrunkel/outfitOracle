import 'tailwindcss/tailwind.css'
import { CartProvider } from '../context/cartContext'

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  )
}

export default MyApp

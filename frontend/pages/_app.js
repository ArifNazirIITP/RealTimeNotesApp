import '@/styles/globals.css';
import { AuthProvider } from '@/utils/auth';
import { ThemeProvider } from 'next-themes'


export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class">
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ThemeProvider>
  )
}

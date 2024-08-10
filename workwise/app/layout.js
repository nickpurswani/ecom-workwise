import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from './context/authContext';
import ErrorBoundary from './components/ErrorBoundary'
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <ErrorBoundary>
        <AuthProvider>
          {children}
        </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

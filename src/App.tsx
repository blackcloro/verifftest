import React from "react";
import "./styles.css";
import Checks from "./Checks"
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

export default function App() {
  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
        <Checks />
    </QueryClientProvider>
  )
}

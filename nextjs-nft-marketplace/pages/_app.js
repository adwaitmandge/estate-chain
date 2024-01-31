import Header from "@/components/Header"
import "@/styles/globals.css"
import Head from "next/head"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"

import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client"

const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "https://api.studio.thegraph.com/query/59209/thala/0.02",
})

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL
const APP_ID = process.env.NEXT_PUBLIC_APPLICATION_ID

export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <title>NFT-Marketplace</title>
                <meta name="description" content="NFT Marketplace" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MoralisProvider initializeOnMount={false}>
                <ApolloProvider client={client}>
                    <NotificationProvider>
                        <Header />
                        <Component {...pageProps} />
                    </NotificationProvider>
                </ApolloProvider>
            </MoralisProvider>
        </>
    )
}

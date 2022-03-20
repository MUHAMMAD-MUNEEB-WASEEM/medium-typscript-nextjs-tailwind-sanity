import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Header from '../components/Header/Header'

const Home: NextPage = () => {
  return (
    <div className="">
      <Head>
        <title>Medium Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>This is medium 2.0</h1>
      <Header/>
    </div>
  )
}

export default Home

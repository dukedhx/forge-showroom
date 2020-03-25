import App from 'next/app'
import Router from 'next/router'
import NProgress from 'nprogress'
import { DefaultSeo } from 'next-seo'

const DEFAULT_SEO = {
  title: 'Forge Showroom',
  description: 'A curated portfolio of samples and solutions developed using Forge',
  openGraph: {
    type: 'website',
    locale: 'en',
    title: 'Forge Showroom',
    description: 'A curated portfolio of samples and solutions developed using Forge.',
    site_name: 'Forge-Showroom'
  }
}

export default class CustomApp extends App {
  componentDidMount() {
    Router.events.on('routeChangeComplete', () => {
      NProgress.start()
    })

    Router.events.on('routeChangeComplete', () => {
      NProgress.done()
    })
    Router.events.on('routeChangeError', () => {
      NProgress.done()
    })
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error)
    super.componentDidCatch(error, errorInfo)
  }

  render() {
    const { Component, pageProps } = this.props

    return (
      <>
        <DefaultSeo {...DEFAULT_SEO} />
        <Component {...pageProps} />
      </>
    )
  }
}

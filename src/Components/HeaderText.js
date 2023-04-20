
import Head from 'next/head'
import { AppManifest } from '../DataSource/RandData'

 const Header=(props)=>{
    const name = props.name
        return (
            <Head>
            <title>{ name ? name :AppManifest.name}</title>
            <meta name={AppManifest.desc} content={AppManifest.content} />
            <link rel="ico" href='/logo.ico'/>
            </Head>
        )
    }
export default Header
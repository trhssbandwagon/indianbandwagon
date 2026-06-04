import { createClient } from '@/prismicio'
import Navbar from './Navbar'

const Header = async (): Promise<React.JSX.Element> => {
  const client = createClient()
  const settings = await client.getSingle('settings')
  const layout = await client.getSingle('layout')
  return (
    <>
      <Navbar
        site_title={settings.data.site_title}
        logo={layout.data.logo}
        navigation={layout.data.navigation}
        cta_link={layout.data.cta_link}
      />
    </>
  )
}

export default Header

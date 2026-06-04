import { createClient } from '@/prismicio'
import FooterContent from './FooterContent'

const Footer = async (): Promise<React.JSX.Element> => {
  const client = createClient()
  const settings = await client.getSingle('settings')
  const layout = await client.getSingle('layout')
  return (
    <>
      <FooterContent data={layout.data} settings={settings.data} />
    </>
  )
}

export default Footer

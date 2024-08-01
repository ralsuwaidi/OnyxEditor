import { Book, Hash, NotePencil, Tray } from '@phosphor-icons/react'

import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '../common/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '../common/sidebar'
import { SidebarLayout } from '../common/sidebar-layout'

import {
  InboxIcon,
  PencilSquareIcon,
} from '@heroicons/react/20/solid'
import NoteSidebarItem from './NoteSidebarItem'

export default function DesktopSidebar({ children }: { children: React.ReactNode }) {
  return (
    <SidebarLayout
      navbar={
        <Navbar>
          <NavbarSpacer />
          <NavbarSection>
            <NavbarItem href="/Note" aria-label="Note">
              <PencilSquareIcon />
            </NavbarItem>
            <NavbarItem href="/inbox" aria-label="Inbox">
              <InboxIcon />
            </NavbarItem>
          </NavbarSection>
        </Navbar>
      }
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarSection className="max-lg:hidden">
              <SidebarItem href="/Note">
                <NotePencil weight="duotone" size={20} />
                <SidebarLabel>Note</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/Journal">
                <Book weight="duotone" size={20} />
                <SidebarLabel>Journal</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/Quick">
                <Tray weight="duotone" size={20} />
                <SidebarLabel>Quick Notes</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/">
                <NoteSidebarItem title="My Note" description='This is my note' />
              </SidebarItem>
              <SidebarItem href="/">
                <NoteSidebarItem title="My Note" description='This is my note' />
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter className="max-lg:hidden">
            <SidebarItem href="/">
              <Hash size={20} />
              <SidebarLabel>Home</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/">
              <Hash size={20} />
              <SidebarLabel>Home</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/">
              <Hash size={20} />
              <SidebarLabel>Home</SidebarLabel>
            </SidebarItem>
          </SidebarFooter>
        </Sidebar>
      }
    >

      {children}
    </SidebarLayout>
  )
}

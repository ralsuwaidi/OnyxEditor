import { Book, Hash, NotePencil, Tray } from '@phosphor-icons/react'

import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '../../../../components/navbar'
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from '../../../../components/sidebar'
import { SidebarLayout } from '../../../../components/sidebar-layout'

import {
  InboxIcon,
  PencilSquareIcon,
} from '@heroicons/react/20/solid'
import NoteListWrapper from './NoteListWrapper'

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
              <NoteListWrapper />
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
      <div className="flex justify-center">
        <div className="max-w-4xl w-full">
          {children}
        </div>
      </div>

    </SidebarLayout>
  )
}
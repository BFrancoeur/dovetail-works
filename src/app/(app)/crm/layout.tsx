import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { CRMSidebar } from '@/components/organisms/CRMSidebar/CRMSidebar'
import styles from './crm.module.css'

export default async function CRMLayout({ children }: { children: React.ReactNode }) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })

  if (!user) redirect('/admin/login')

  // Fetch today's tasks for My Day sidebar panel
  const today = new Date()
  const startOfDay = new Date(today.setHours(0, 0, 0, 0)).toISOString()
  const endOfDay   = new Date(today.setHours(23, 59, 59, 999)).toISOString()

  const tasksResult = await payload.find({
    collection: 'tasks',
    where: {
      and: [
        { dueDate:  { greater_than_equal: startOfDay } },
        { dueDate:  { less_than_equal:    endOfDay   } },
        { status:   { not_equals:         'completed' } },
        { status:   { not_equals:         'cancelled' } },
      ],
    },
    limit: 20,
    sort: 'dueDate',
    overrideAccess: false,
    user,
  })

  const todayTasks = tasksResult.docs.map((t) => ({
    id:      String(t.id),
    title:   String(t.title),
    type:    String(t.type ?? 'other'),
    dueDate: String(t.dueDate ?? ''),
    status:  String(t.status ?? 'pending'),
  }))

  return (
    <div className={styles.shell}>
      <CRMSidebar todayTasks={todayTasks} />
      <main className={styles.main}>
        {children}
      </main>
    </div>
  )
}

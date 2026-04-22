import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Fetch all inquiries (admin only)
export async function GET() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch inquiries ordered by newest first
  const { data: inquiries, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[admin/inquiries] Fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 })
  }

  return NextResponse.json({ inquiries })
}

// PATCH - Update inquiry (status, notes)
export async function PATCH(request: Request) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { id, status, notes } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing inquiry ID' }, { status: 400 })
  }

  // Build update object
  const updates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  }
  
  if (status !== undefined) {
    const validStatuses = ['new', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'archived']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    updates.status = status
  }
  
  if (notes !== undefined) {
    updates.notes = notes
  }

  const { error } = await supabase
    .from('inquiries')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('[admin/inquiries] Update error:', error)
    return NextResponse.json({ error: 'Failed to update inquiry' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

// DELETE - Delete inquiry
export async function DELETE(request: Request) {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Missing inquiry ID' }, { status: 400 })
  }

  const { error } = await supabase
    .from('inquiries')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('[admin/inquiries] Delete error:', error)
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}

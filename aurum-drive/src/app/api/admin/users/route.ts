import { NextRequest, NextResponse } from 'next/server'
import {
  requireAdminSession,
  loadUsersData,
  saveUsersData,
  loadDynamicUsers,
  saveDynamicUsers,
  sha256,
  AUTH_SALT,
  KNOWN_USERS,
  DynamicUserRecord,
} from '@/lib/admin-auth'

export const runtime = 'edge'

const MAX_CUSTOM_USERS = 20

// Built-in public admin info (excluding developer wailio)
const BUILTIN_ADMIN = {
  id: 'builtin-admin',
  username: 'toweradmin',
  displayName: 'Tower Admin (Principal)',
  role: 'admin' as const,
  email: 'admin@chateauart.dz',
  phone: '0561 71 91 00',
  createdAt: '2024-01-01T00:00:00Z',
  status: 'active' as const,
  permissions: ['products', 'orders', 'sales', 'website-info'],
  isBuiltIn: true,
}

export async function GET(request: NextRequest) {
  try {
    const session = await requireAdminSession(request)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { deletedBuiltins, users: dynamicUsers } = await loadUsersData()

    // Map and sanitize (never return passwordHash)
    const sanitized = dynamicUsers.map((u) => ({
      id: u.id || u.username,
      username: u.username,
      displayName: u.displayName || u.username,
      role: u.role || 'admin',
      email: u.email || '',
      phone: u.phone || '',
      createdAt: u.createdAt || new Date().toISOString(),
      lastLogin: u.lastLogin || null,
      status: u.status || 'active',
      permissions: u.permissions || ['products', 'orders', 'sales', 'website-info'],
      isBuiltIn: false,
    }))

    // Combined list: default admin (if not deleted) + custom users
    const isTowerAdminDeleted = deletedBuiltins.includes('toweradmin')
    const allUsers = [
      ...(isTowerAdminDeleted ? [] : [BUILTIN_ADMIN]),
      ...sanitized,
    ]

    return NextResponse.json({
      users: allUsers,
      totalCount: allUsers.length,
      customCount: dynamicUsers.length,
      maxCustomUsers: MAX_CUSTOM_USERS,
    })
  } catch (err: any) {
    console.error('GET /api/admin/users error:', err)
    return NextResponse.json({ error: 'Erreur lors du chargement des utilisateurs' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireAdminSession(request)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { username, password, displayName, email, phone, permissions } = body

    if (!username || !password) {
      return NextResponse.json(
        { error: "Le nom d'utilisateur et le mot de passe sont obligatoires" },
        { status: 400 }
      )
    }

    const cleanUsername = String(username).toLowerCase().trim()
    if (!/^[a-z0-9_-]{3,24}$/.test(cleanUsername)) {
      return NextResponse.json(
        { error: "L'identifiant doit comporter entre 3 et 24 caractères alphanumériques (a-z, 0-9, _, -)" },
        { status: 400 }
      )
    }

    if (String(password).length < 4) {
      return NextResponse.json(
        { error: 'Le mot de passe doit comporter au moins 4 caractères' },
        { status: 400 }
      )
    }

    // Check if reserved by built-in users
    if (KNOWN_USERS[cleanUsername]) {
      return NextResponse.json(
        { error: "Cet identifiant est réservé et ne peut pas être réutilisé" },
        { status: 400 }
      )
    }

    const currentUsers = await loadDynamicUsers()

    // Enforce 20 custom users limit
    if (currentUsers.length >= MAX_CUSTOM_USERS) {
      return NextResponse.json(
        { error: `Limite atteinte : un maximum de ${MAX_CUSTOM_USERS} utilisateurs supplémentaires est autorisé` },
        { status: 400 }
      )
    }

    // Check duplicate
    if (currentUsers.some((u) => u.username.toLowerCase() === cleanUsername)) {
      return NextResponse.json(
        { error: "Un utilisateur avec cet identifiant existe déjà" },
        { status: 400 }
      )
    }

    const passwordHash = await sha256(password + AUTH_SALT)

    const newUser: DynamicUserRecord = {
      id: 'usr_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      username: cleanUsername,
      displayName: displayName?.trim() || cleanUsername,
      role: 'admin',
      email: email?.trim() || '',
      phone: phone?.trim() || '',
      createdAt: new Date().toISOString(),
      status: 'active',
      permissions: Array.isArray(permissions) && permissions.length > 0
        ? permissions
        : ['products', 'orders', 'sales', 'website-info'],
      passwordHash,
    }

    const updatedList = [newUser, ...currentUsers]
    const saved = await saveDynamicUsers(updatedList)

    if (!saved) {
      return NextResponse.json(
        { error: 'Échec de la sauvegarde dans la base Supabase' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Utilisateur créé avec succès et prêt à se connecter immédiatement',
      user: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
        email: newUser.email,
        phone: newUser.phone,
        createdAt: newUser.createdAt,
        status: newUser.status,
        permissions: newUser.permissions,
        isBuiltIn: false,
      },
    }, { status: 201 })
  } catch (err: any) {
    console.error('POST /api/admin/users error:', err)
    return NextResponse.json({ error: 'Erreur serveur lors de la création' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await requireAdminSession(request)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json({ error: 'Nom d\'utilisateur requis' }, { status: 400 })
    }

    const cleanUsername = username.toLowerCase().trim()
    if (cleanUsername === 'wailio') {
      return NextResponse.json({ error: 'Impossible de supprimer le compte développeur principal' }, { status: 403 })
    }

    const { deletedBuiltins, users: currentUsers } = await loadUsersData()

    if (cleanUsername === 'toweradmin') {
      if (!deletedBuiltins.includes('toweradmin')) {
        deletedBuiltins.push('toweradmin')
        await saveUsersData({ deletedBuiltins, users: currentUsers })
      }
      return NextResponse.json({ success: true, message: 'Utilisateur Tower Admin supprimé avec succès' })
    }

    const filtered = currentUsers.filter((u) => u.username.toLowerCase() !== cleanUsername)

    if (filtered.length === currentUsers.length) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    const saved = await saveUsersData({ deletedBuiltins, users: filtered })
    if (!saved) {
      return NextResponse.json({ error: 'Erreur lors de la mise à jour Supabase' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Utilisateur supprimé avec succès' })
  } catch (err: any) {
    console.error('DELETE /api/admin/users error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await requireAdminSession(request)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { username, permissions, role, status } = body

    if (!username) {
      return NextResponse.json({ error: "Nom d'utilisateur requis" }, { status: 400 })
    }

    const cleanUsername = String(username).toLowerCase().trim()
    const currentUsers = await loadDynamicUsers()
    const userIndex = currentUsers.findIndex((u) => u.username.toLowerCase() === cleanUsername)

    if (userIndex === -1 && cleanUsername !== 'toweradmin') {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
    }

    if (userIndex !== -1) {
      const user = currentUsers[userIndex]
      if (Array.isArray(permissions)) user.permissions = permissions
      if (role && (role === 'admin' || role === 'developer')) user.role = role
      if (status && (status === 'active' || status === 'inactive' || status === 'suspended')) user.status = status

      currentUsers[userIndex] = user
      await saveDynamicUsers(currentUsers)

      return NextResponse.json({
        success: true,
        message: 'Utilisateur mis à jour avec succès',
        user: {
          id: user.id,
          username: user.username,
          displayName: user.displayName,
          role: user.role,
          email: user.email,
          phone: user.phone,
          createdAt: user.createdAt,
          status: user.status,
          permissions: user.permissions,
        },
      })
    }

    return NextResponse.json({ success: true, message: 'Compte principal mis à jour localement' })
  } catch (err: any) {
    console.error('PATCH /api/admin/users error:', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
